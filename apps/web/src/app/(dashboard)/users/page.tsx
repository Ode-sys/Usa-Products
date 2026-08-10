"use client";

import { useState } from "react";
import { toast } from "sonner";

interface Member {
  id: string;
  name: string;
  email: string;
  role: string;
  status: "ACTIVE" | "INVITED" | "SUSPENDED";
  joinedAt: string;
  lastActive: string;
}

const SAMPLE_MEMBERS: Member[] = [
  { id: "1", name: "محمد العتيبي", email: "m.otaibi@example.com", role: "CLIENT_ADMIN", status: "ACTIVE", joinedAt: "2024-10-01", lastActive: "منذ ساعتين" },
  { id: "2", name: "هند الشمري", email: "h.shamri@example.com", role: "CLIENT_USER", status: "ACTIVE", joinedAt: "2024-11-15", lastActive: "منذ يوم" },
  { id: "3", name: "عمر البلوي", email: "omar@example.com", role: "VIEWER", status: "INVITED", joinedAt: "2025-01-08", lastActive: "—" },
];

const ROLE_LABELS: Record<string, string> = {
  CLIENT_ADMIN: "مدير العميل",
  CLIENT_USER: "مستخدم",
  VIEWER: "مشاهد",
  AGENCY_STAFF: "موظف وكالة",
  BILLING_MANAGER: "مدير الفواتير",
};

const STATUS_STYLE: Record<string, string> = {
  ACTIVE: "bg-green-100 text-green-700",
  INVITED: "bg-yellow-100 text-yellow-700",
  SUSPENDED: "bg-red-100 text-red-600",
};

const STATUS_LABEL: Record<string, string> = {
  ACTIVE: "نشط",
  INVITED: "دعوة معلقة",
  SUSPENDED: "موقوف",
};

export default function UsersPage() {
  const [members, setMembers] = useState<Member[]>(SAMPLE_MEMBERS);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState("CLIENT_USER");

  async function sendInvite() {
    if (!inviteEmail.trim()) { toast.error("أدخل البريد الإلكتروني"); return; }
    const token = localStorage.getItem("accessToken");
    try {
      const res = await fetch("/api/users/invite", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify({ email: inviteEmail, role: inviteRole }),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success("تم إرسال الدعوة");
        setMembers((prev) => [
          ...prev,
          {
            id: Date.now().toString(),
            name: inviteEmail.split("@")[0],
            email: inviteEmail,
            role: inviteRole,
            status: "INVITED",
            joinedAt: new Date().toISOString().split("T")[0],
            lastActive: "—",
          },
        ]);
        setShowInviteModal(false);
        setInviteEmail("");
      } else {
        toast.error(data.error || "فشل إرسال الدعوة");
      }
    } catch {
      toast.error("خطأ في الاتصال");
    }
  }

  function suspendMember(id: string) {
    setMembers((prev) =>
      prev.map((m) => (m.id === id ? { ...m, status: m.status === "SUSPENDED" ? "ACTIVE" : "SUSPENDED" } : m))
    );
    toast.success("تم تحديث حالة العضو");
  }

  return (
    <div className="p-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">إدارة الأعضاء</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">إدارة الأعضاء وأدوارهم وصلاحياتهم في حسابك</p>
        </div>
        <button
          onClick={() => setShowInviteModal(true)}
          className="px-4 py-2 bg-purple-600 text-white rounded-xl text-sm font-semibold hover:bg-purple-700 transition-colors"
        >
          + دعوة عضو
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { label: "إجمالي الأعضاء", value: members.length, color: "bg-purple-50 dark:bg-purple-900/10 text-purple-700 dark:text-purple-300" },
          { label: "نشطون", value: members.filter((m) => m.status === "ACTIVE").length, color: "bg-green-50 dark:bg-green-900/10 text-green-700 dark:text-green-300" },
          { label: "دعوات معلقة", value: members.filter((m) => m.status === "INVITED").length, color: "bg-yellow-50 dark:bg-yellow-900/10 text-yellow-700 dark:text-yellow-300" },
        ].map((s) => (
          <div key={s.label} className={`${s.color} rounded-xl p-4`}>
            <p className="text-2xl font-bold">{s.value}</p>
            <p className="text-xs mt-0.5 opacity-70">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Members table */}
      <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-700">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 dark:bg-gray-800">
            <tr>
              {["العضو", "الدور", "الحالة", "تاريخ الانضمام", "آخر نشاط", "إجراءات"].map((h) => (
                <th key={h} className="px-4 py-3 text-right text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
            {members.map((m) => (
              <tr key={m.id} className="bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800/50">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center text-purple-700 dark:text-purple-300 font-bold text-xs">
                      {m.name[0]}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white text-xs">{m.name}</p>
                      <p className="text-gray-400 text-xs">{m.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span className="text-xs px-2 py-0.5 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded-full">
                    {ROLE_LABELS[m.role] ?? m.role}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${STATUS_STYLE[m.status]}`}>
                    {STATUS_LABEL[m.status]}
                  </span>
                </td>
                <td className="px-4 py-3 text-xs text-gray-500">{m.joinedAt}</td>
                <td className="px-4 py-3 text-xs text-gray-400">{m.lastActive}</td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <button className="text-xs text-blue-600 hover:text-blue-700 font-medium">تعديل</button>
                    <button
                      onClick={() => suspendMember(m.id)}
                      className="text-xs text-red-500 hover:text-red-600 font-medium"
                    >
                      {m.status === "SUSPENDED" ? "تفعيل" : "تعليق"}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Invite modal */}
      {showInviteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 w-full max-w-md shadow-2xl">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">دعوة عضو جديد</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">البريد الإلكتروني</label>
                <input
                  type="email"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  placeholder="example@company.com"
                  className="w-full rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2.5 text-sm focus:outline-none focus:border-purple-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">الدور</label>
                <select
                  value={inviteRole}
                  onChange={(e) => setInviteRole(e.target.value)}
                  className="w-full rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2.5 text-sm focus:outline-none focus:border-purple-500"
                >
                  {Object.entries(ROLE_LABELS).map(([k, v]) => (
                    <option key={k} value={k}>{v}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={sendInvite}
                className="flex-1 py-2.5 bg-purple-600 text-white rounded-xl font-semibold text-sm hover:bg-purple-700"
              >
                إرسال الدعوة
              </button>
              <button
                onClick={() => setShowInviteModal(false)}
                className="flex-1 py-2.5 border border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-400 rounded-xl text-sm hover:bg-gray-50 dark:hover:bg-gray-800"
              >
                إلغاء
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

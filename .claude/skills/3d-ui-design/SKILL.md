# Skill: 3D UI Design — حضاري

## الغرض

بناء واجهات مستخدم ثلاثية الأبعاد احترافية وحضارية باستخدام أحدث تقنيات الويب: Three.js، React Three Fiber، WebGL Shaders، CSS 3D، وSpline. تشمل المهارة التصميم التفاعلي، الجسيمات، الإضاءة الديناميكية، والأنيميشن الاحترافي.

---

## المكدس التقني (Tech Stack)

### المحركات الأساسية
- **Three.js** — محرك WebGL الأساسي
- **React Three Fiber (R3F)** — Three.js كـ React components
- **@react-three/drei** — مساعدات جاهزة (lights, shadows, effects)
- **@react-three/postprocessing** — تأثيرات بعد المعالجة (Bloom, DOF, Glitch)
- **Leva** — لوحة تحكم مباشرة للـ 3D scenes

### الأنيميشن
- **GSAP + ScrollTrigger** — ربط الـ 3D بالـ scroll
- **Framer Motion 3D** — حركات React ثلاثية الأبعاد
- **React Spring Three** — فيزياء الحركة الواقعية

### التصميم المرئي
- **Spline** — تصميم 3D بدون كود، export مباشر لـ React
- **Shader Language (GLSL)** — مواد مخصصة ومذهلة
- **CSS 3D Transforms** — بطاقات وعناصر 3D بدون WebGL
- **Lottie** — أنيميشن فيكتور مخصص

### التأثيرات البصرية
- Glassmorphism 3D
- Particle systems
- Procedural geometry
- Environment maps / HDRI lighting
- Screen-space reflections

---

## مبادئ التصميم الثلاثي الأبعاد

### 1. الإضاءة أولاً
```jsx
// الإضاءة هي روح المشهد — لا تبخل عليها
<ambientLight intensity={0.2} />
<directionalLight position={[5, 5, 5]} intensity={1.5} castShadow />
<pointLight position={[-3, 3, -3]} color="#6366f1" intensity={2} />
<hemisphereLight skyColor="#1a1a2e" groundColor="#000000" intensity={0.5} />

// Environment map للانعكاسات الواقعية
<Environment preset="city" />
```

### 2. المواد (Materials) — قلب الجمال
```glsl
/* Custom Holographic Shader */
uniform float uTime;
uniform vec3 uColor;
varying vec2 vUv;
varying vec3 vNormal;

void main() {
  // تدرج لوني بناءً على الـ normal
  float fresnel = pow(1.0 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 3.0);
  
  // نبض زمني
  float pulse = sin(uTime * 2.0 + vUv.y * 10.0) * 0.5 + 0.5;
  
  vec3 color = mix(uColor, vec3(1.0), fresnel * 0.7);
  color += pulse * 0.1 * uColor;
  
  gl_FragColor = vec4(color, 0.85 + fresnel * 0.15);
}
```

### 3. الكاميرا وحركتها
```jsx
import { OrbitControls, PerspectiveCamera } from '@react-three/drei'

// كاميرا مع تأخير (damping) للحركة الناعمة
<OrbitControls
  enableDamping
  dampingFactor={0.05}
  minDistance={3}
  maxDistance={20}
  maxPolarAngle={Math.PI / 2}
/>

// تتبع الـ mouse
const { viewport } = useThree()
useFrame((state) => {
  mesh.current.rotation.y = THREE.MathUtils.lerp(
    mesh.current.rotation.y,
    (state.pointer.x * viewport.width) / 100,
    0.05
  )
})
```

---

## قوالب جاهزة

### 1. بطاقة ثلاثية الأبعاد (3D Card)

```jsx
import { Canvas } from '@react-three/fiber'
import { Float, RoundedBox, MeshDistortMaterial } from '@react-three/drei'

function HolographicCard() {
  const meshRef = useRef()
  const { pointer } = useThree()

  useFrame(() => {
    meshRef.current.rotation.x = THREE.MathUtils.lerp(
      meshRef.current.rotation.x, pointer.y * 0.3, 0.05
    )
    meshRef.current.rotation.y = THREE.MathUtils.lerp(
      meshRef.current.rotation.y, pointer.x * 0.3, 0.05
    )
  })

  return (
    <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.5}>
      <RoundedBox ref={meshRef} args={[3, 2, 0.1]} radius={0.1}>
        <MeshDistortMaterial
          color="#6366f1"
          metalness={0.8}
          roughness={0.1}
          distort={0.1}
          speed={2}
          transparent
          opacity={0.9}
        />
      </RoundedBox>
    </Float>
  )
}

export default function Card3D() {
  return (
    <Canvas camera={{ position: [0, 0, 5] }}>
      <HolographicCard />
      <Environment preset="city" />
    </Canvas>
  )
}
```

### 2. نظام جسيمات تفاعلي

```jsx
import { useMemo } from 'react'
import * as THREE from 'three'

function Particles({ count = 5000 }) {
  const [positions, colors] = useMemo(() => {
    const positions = new Float32Array(count * 3)
    const colors = new Float32Array(count * 3)

    for (let i = 0; i < count; i++) {
      // توزيع كروي
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)
      const r = 3 + Math.random() * 2

      positions[i * 3]     = r * Math.sin(phi) * Math.cos(theta)
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta)
      positions[i * 3 + 2] = r * Math.cos(phi)

      // ألوان متدرجة
      const color = new THREE.Color()
      color.setHSL(0.6 + Math.random() * 0.2, 1, 0.5 + Math.random() * 0.3)
      colors[i * 3]     = color.r
      colors[i * 3 + 1] = color.g
      colors[i * 3 + 2] = color.b
    }

    return [positions, colors]
  }, [count])

  const pointsRef = useRef()
  useFrame((state) => {
    pointsRef.current.rotation.y = state.clock.getElapsedTime() * 0.05
  })

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.02} vertexColors sizeAttenuation transparent opacity={0.8} />
    </points>
  )
}
```

### 3. نص ثلاثي الأبعاد متوهج

```jsx
import { Text3D, Center } from '@react-three/drei'

function GlowText({ text = 'حضاري' }) {
  return (
    <Center>
      <Text3D
        font="/fonts/inter_bold.json"
        size={0.8}
        height={0.1}
        curveSegments={32}
        bevelEnabled
        bevelThickness={0.02}
        bevelSize={0.01}
      >
        {text}
        <meshStandardMaterial
          color="#ffffff"
          emissive="#6366f1"
          emissiveIntensity={0.5}
          metalness={0.9}
          roughness={0.1}
        />
      </Text3D>
    </Center>
  )
}
```

### 4. خلفية شبكية ثلاثية الأبعاد (Grid Background)

```jsx
import { Grid, GizmoHelper, GizmoViewport } from '@react-three/drei'

function Scene3DBackground() {
  return (
    <>
      <Grid
        args={[30, 30]}
        position={[0, -2, 0]}
        cellSize={0.5}
        cellThickness={0.5}
        cellColor="#6366f1"
        sectionSize={3}
        sectionThickness={1}
        sectionColor="#818cf8"
        fadeDistance={25}
        fadeStrength={1}
        followCamera={false}
        infiniteGrid
      />
      <fog attach="fog" args={['#0a0a1a', 10, 30]} />
    </>
  )
}
```

### 5. تأثيرات Post-Processing

```jsx
import { EffectComposer, Bloom, ChromaticAberration, Noise, Vignette } from '@react-three/postprocessing'
import { BlendFunction } from 'postprocessing'

function PostEffects() {
  return (
    <EffectComposer>
      {/* توهج */}
      <Bloom
        luminanceThreshold={0.3}
        luminanceSmoothing={0.9}
        mipmapBlur
        intensity={1.5}
      />
      {/* انحراف لوني */}
      <ChromaticAberration
        blendFunction={BlendFunction.NORMAL}
        offset={[0.002, 0.002]}
      />
      {/* حبيبات فيلمية */}
      <Noise opacity={0.03} />
      {/* ظلام الحواف */}
      <Vignette eskil={false} offset={0.1} darkness={0.8} />
    </EffectComposer>
  )
}
```

### 6. Scroll-driven 3D Animation

```jsx
import { useScroll } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { ScrollControls } from '@react-three/drei'

function ScrollScene() {
  const scroll = useScroll()
  const meshRef = useRef()

  useFrame(() => {
    const t = scroll.offset // 0 → 1

    // دوران بالـ scroll
    meshRef.current.rotation.y = t * Math.PI * 2
    // تحريك بالـ scroll
    meshRef.current.position.z = -t * 10
    // تغيير الحجم
    const scale = 1 + t * 0.5
    meshRef.current.scale.set(scale, scale, scale)
  })

  return <mesh ref={meshRef}><boxGeometry /><meshStandardMaterial /></mesh>
}

// الاستخدام:
<Canvas>
  <ScrollControls pages={5} damping={0.1}>
    <ScrollScene />
  </ScrollControls>
</Canvas>
```

---

## CSS 3D بدون WebGL (للبطاقات والعناصر البسيطة)

```css
/* Container 3D */
.scene {
  perspective: 1000px;
  perspective-origin: center;
}

/* بطاقة 3D تتبع الماوس */
.card-3d {
  transform-style: preserve-3d;
  transition: transform 0.1s ease;
  will-change: transform;
}

/* طبقات العمق */
.card-front  { transform: translateZ(0px); }
.card-content { transform: translateZ(40px); }
.card-badge  { transform: translateZ(80px); }
.card-shine  { transform: translateZ(60px); mix-blend-mode: overlay; }

/* توهج */
.card-glow {
  box-shadow:
    0 0 30px rgba(99, 102, 241, 0.3),
    0 0 60px rgba(99, 102, 241, 0.1),
    inset 0 0 30px rgba(99, 102, 241, 0.05);
}
```

```js
// تتبع الماوس للبطاقة CSS
card.addEventListener('mousemove', (e) => {
  const rect = card.getBoundingClientRect()
  const x = (e.clientX - rect.left) / rect.width  - 0.5
  const y = (e.clientY - rect.top) / rect.height - 0.5

  card.style.transform = `
    rotateY(${x * 20}deg)
    rotateX(${-y * 20}deg)
    translateZ(10px)
  `
})
card.addEventListener('mouseleave', () => {
  card.style.transform = 'rotateY(0) rotateX(0) translateZ(0)'
})
```

---

## قائمة التثبيت

```bash
# الأساسي
npm install three @react-three/fiber @react-three/drei

# تأثيرات بعد المعالجة
npm install @react-three/postprocessing postprocessing

# أنيميشن
npm install gsap @gsap/react framer-motion

# تحكم ولوحات
npm install leva @react-three/rapier

# أشكال وهندسة
npm install maath
```

---

## سير العمل

```
طلب 3D UI
     ↓
1. حدد الغرض: بطاقة / خلفية / صفحة كاملة / مكون
     ↓
2. اختر المحرك المناسب:
   ├─ بسيط (بطاقة/زر) → CSS 3D
   ├─ متوسط (hero section) → Spline embed
   └─ متقدم (تفاعلي/تأثيرات) → React Three Fiber
     ↓
3. ضع الإضاءة أولاً — ثم المواد — ثم الهندسة
     ↓
4. أضف الأنيميشن والتفاعل
     ↓
5. أضف Post-Processing (Bloom أساسي دائماً)
     ↓
6. تحقق من الأداء: < 60 FPS → reduce geometry أو use instancing
```

---

## معايير الأداء

| العنصر | الهدف |
|--------|-------|
| FPS | ≥ 60 على desktop، ≥ 30 على mobile |
| Polygons | < 100k لـ hero scene |
| Textures | < 4MB مضغوطة |
| Draw calls | < 50 |
| Load time | < 3s حتى أول frame |

```jsx
// دائماً استخدم instancing للعناصر المتكررة
import { Instances, Instance } from '@react-three/drei'

<Instances limit={1000}>
  <boxGeometry />
  <meshStandardMaterial />
  {positions.map((pos, i) => (
    <Instance key={i} position={pos} />
  ))}
</Instances>
```

---

## ملاحظات

- **Mobile first**: أضف `dpr={[1, 2]}` لـ Canvas وتحقق من `isMobile`
- **Accessibility**: أضف `aria-hidden="true"` للـ Canvas وتأكد من قراءة المحتوى بدونه
- **Fallback**: أضف `<Suspense fallback={<Spinner />}>` لكل مشهد
- **Dark mode**: كل الأمثلة أعلاه مصممة للخلفيات الداكنة — عدّل الألوان للفاتح

# deployment

Guide Expo app release and deployment workflows.

## When to use
When preparing an Expo or React Native app for release to the App Store, Google Play, or OTA update.

## Over-the-Air (OTA) update
```bash
eas update --branch production --message "Fix login crash"
```

## App Store / Play Store build
```bash
eas build --platform ios --profile production
eas build --platform android --profile production
eas submit --platform ios
eas submit --platform android
```

## Pre-release checklist
- [ ] Version bumped in app.json
- [ ] Environment variables set for production profile
- [ ] Splash screen and icons are correct
- [ ] Deep links / universal links configured
- [ ] Privacy manifest (iOS) complete
- [ ] Push notification certificates valid

## Source
Expo (expo/skills)

# Dependency posture

The first development target uses Expo SDK 54 because the current Expo Go path on
the available physical Android device supports that SDK. Production dependency
audits currently report transitive advisories inside Expo/React Native build
tooling. Applying `npm audit fix --force` would replace the selected SDK and React
Native versions, so it must not be used as an automatic remediation.

Before a public release:

1. Re-run `npm audit` and classify runtime versus build-time reachability.
2. Move to the newest Expo SDK supported by the intended device-testing path.
3. Run lint, types, unit tests, both platform exports, and device smoke tests.
4. Record any remaining accepted advisory with its exact package path and expiry.

No secrets or user accounts are required by the current offline application.
Learning history remains on the device.

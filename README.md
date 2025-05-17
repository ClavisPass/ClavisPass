# ClavisPass

[Expo Dev](https://docs.expo.dev/versions/latest/)

[react native paper](https://callstack.github.io/react-native-paper/docs/components/ActivityIndicator)

[material design icons](https://pictogrammers.com/library/mdi/)

# ClavisPass

**Take control of your passwords – securely and seamlessly.**  
ClavisPass is a modern, privacy-focused password manager that works *with your own cloud*. Use Dropbox (or any other file-based sync) to securely manage your encrypted vault across all your devices.

---

## 🚀 Features

- 🔑 **Local Encryption Only**  
  Your data is encrypted on your device — it never leaves your hands unprotected.

- ☁️ **Sync with Your Cloud**  
  Use Dropbox (or any cloud provider) to sync your vault privately without a centralized server.

- 🧩 **Cross-Platform**  
  Available for **Linux, Windows, macOS, iOS**, and **Android** – one experience across all devices.

- 🧠 **Simple & Focused Design**  
  No bloat, just what you need to manage your credentials — clean, fast, and minimal.

---

## 📱 Platforms

| Platform | Status |
|---------|--------|
| 🖥️ Windows | ✅ Released |
| 🐧 Linux   | ✅ Released |
| 🍎 macOS   | ✅ Released |
| 📱 Android | 🚧 Coming soon |
| 📱 iOS     | 🚧 Coming soon |

---

## 🛠 Installation

### Desktop

Download the latest release for your platform from the [Releases Page](https://github.com/riciric/ClavisPass/releases).

### Mobile

> *Coming soon via Expo and app stores*

---

## 🔒 Security

ClavisPass encrypts your data using modern cryptographic standards (AES-256).  
Only you hold the key – no servers, no tracking, no compromise.

You can even inspect the source code or build it yourself!

```mermaid
flowchart TD
    A[Master Password] --> B[Key Derivation: PBKDF2 or Argon2]
    B --> C[Generate Encryption Key]
    C --> D[Vault Data (JSON)]
    D --> E[AES-256 Encryption]
    E --> F[Encrypted Vault File (.clavisvault)]
    F --> G[Sync via Dropbox or Cloud]

    style A fill:#f9f,stroke:#333,stroke-width:1px
    style G fill:#bbf,stroke:#333,stroke-width:1px
```

---

## 📸 Screenshots

> *(Insert screenshots or a GIF of your app here to make the project visually appealing)*

---

## ❓ FAQ

> See the [FAQ section on the homepage](https://your-project-url.com) or the bottom of this README for common questions and answers.

---

## 🧑‍💻 Contributing

Pull requests and feedback are welcome!

1. Fork the repo
2. Create your feature branch (`git checkout -b feature/your-feature`)
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License – see the [LICENSE](LICENSE) file for details.

---

## 🌐 Homepage

[https://your-project-url.com](https://your-project-url.com)
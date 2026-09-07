!include LogicLib.nsh

!define CLAVISPASS_NATIVE_HOST_NAME "com.clavispass.native_host"

; Fill these once the Chrome Web Store / Edge Add-ons IDs are known.
!define CLAVISPASS_CHROME_EXTENSION_ID ""
!define CLAVISPASS_EDGE_EXTENSION_ID ""
!define CLAVISPASS_FIREFOX_EXTENSION_ID "clavispass@arratel.dev"

!macro WriteClavisPassNativeHostManifest MANIFEST_PATH HOST_PATH HOST_PATH_KIND
  FileOpen $0 "${MANIFEST_PATH}" w
  FileWrite $0 "{$\r$\n"
  FileWrite $0 "  $\"name$\": $\"${CLAVISPASS_NATIVE_HOST_NAME}$\",$\r$\n"
  FileWrite $0 "  $\"description$\": $\"ClavisPass Native Messaging Host$\",$\r$\n"
  FileWrite $0 "  $\"path$\": $\"${HOST_PATH}$\",$\r$\n"
  FileWrite $0 "  $\"type$\": $\"stdio$\",$\r$\n"
  ${If} "${HOST_PATH_KIND}" == "chromium"
    FileWrite $0 "  $\"allowed_origins$\": [$\r$\n"
    ${If} "${CLAVISPASS_CHROME_EXTENSION_ID}" != ""
      FileWrite $0 "    $\"chrome-extension://${CLAVISPASS_CHROME_EXTENSION_ID}/$\""
      ${If} "${CLAVISPASS_EDGE_EXTENSION_ID}" != ""
        FileWrite $0 ",$\r$\n"
      ${Else}
        FileWrite $0 "$\r$\n"
      ${EndIf}
    ${EndIf}
    ${If} "${CLAVISPASS_EDGE_EXTENSION_ID}" != ""
      FileWrite $0 "    $\"chrome-extension://${CLAVISPASS_EDGE_EXTENSION_ID}/$\"$\r$\n"
    ${EndIf}
    FileWrite $0 "  ]$\r$\n"
  ${Else}
    FileWrite $0 "  $\"allowed_extensions$\": [$\r$\n"
    FileWrite $0 "    $\"${CLAVISPASS_FIREFOX_EXTENSION_ID}$\"$\r$\n"
    FileWrite $0 "  ]$\r$\n"
  ${EndIf}
  FileWrite $0 "}$\r$\n"
  FileClose $0
!macroend

!macro NSIS_HOOK_POSTINSTALL
  ; Native Messaging registration is repaired on app startup.
  ; This keeps NSIS and MSIX behavior aligned and avoids hand-written JSON path escaping issues.
!macroend

!macro NSIS_HOOK_POSTUNINSTALL
  DeleteRegKey HKCU "Software\Google\Chrome\NativeMessagingHosts\${CLAVISPASS_NATIVE_HOST_NAME}"
  DeleteRegKey HKCU "Software\Chromium\NativeMessagingHosts\${CLAVISPASS_NATIVE_HOST_NAME}"
  DeleteRegKey HKCU "Software\Microsoft\Edge\NativeMessagingHosts\${CLAVISPASS_NATIVE_HOST_NAME}"
  DeleteRegKey HKCU "Software\Mozilla\NativeMessagingHosts\${CLAVISPASS_NATIVE_HOST_NAME}"
  Delete "$INSTDIR\${CLAVISPASS_NATIVE_HOST_NAME}.chromium.json"
  Delete "$INSTDIR\${CLAVISPASS_NATIVE_HOST_NAME}.firefox.json"
  Delete "$LOCALAPPDATA\ClavisPass\bridge\native-hosts\${CLAVISPASS_NATIVE_HOST_NAME}.chromium.json"
  Delete "$LOCALAPPDATA\ClavisPass\bridge\native-hosts\${CLAVISPASS_NATIVE_HOST_NAME}.firefox.json"
  Delete "$LOCALAPPDATA\ClavisPass\bridge\native-hosts\bin\clavispass_native_host.exe"
  RMDir "$LOCALAPPDATA\ClavisPass\bridge\native-hosts\bin"
  RMDir "$LOCALAPPDATA\ClavisPass\bridge\native-hosts"
!macroend

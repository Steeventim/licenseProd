import React from "react";
import { LicenseProvider } from "./hooks/useLicense";
import { LicenseGuard } from "./components/LicenseGuard";
import UnifiedApp from "./components/UnifiedApp";

function App() {
  return (
    <LicenseProvider>
      <LicenseGuard>
        <UnifiedApp />
      </LicenseGuard>
    </LicenseProvider>
  );
}

export default App;

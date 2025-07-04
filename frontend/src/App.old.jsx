import React from "react";
import { Activity, Search, Download, BarChart3 } from "lucide-react";
import { LicenseProvider } from "./hooks/useLicense.jsx";
import { LicenseGuard } from "./components/LicenseGuard";
import { FeatureGuard } from "./components/FeatureGuard";
import { LicenseStatus } from "./components/LicenseStatus";
import { LicenseInfo } from "./components/LicenseInfo";
import { LicenseForm } from "./components/LicenseForm";
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

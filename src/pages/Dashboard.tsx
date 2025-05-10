
// src/pages/Dashboard.tsx
import React from "react";
import { useAuth } from "@/contexts/AuthContext";
import Layout from "@/components/layout/Layout";

export default function Dashboard() {
  const { profile } = useAuth();
  
  return (
    <Layout>
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
        
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold mb-4">Bienvenido, {profile?.full_name || "Usuario"}</h2>
          <p>Este es el panel de control de tu aplicación.</p>
        </div>
      </div>
    </Layout>
  );
}

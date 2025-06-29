"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function ApiTest() {
  const [username, setUsername] = useState("");
  const [apiKey, setApiKey] = useState("");
  const [apiHost, setApiHost] = useState("instagram120.p.rapidapi.com");
  interface TestResult {
    endpoint: string;
    method: string;
    status: number;
    success: boolean;
    data: unknown;
  }

  const [results, setResults] = useState<TestResult[]>([]);
  const [loading, setLoading] = useState(false);

  const endpoints = [
    { url: "/api/instagram/profile", method: "POST", body: { username: "{username}" } },
    { url: "/api/instagram/links", method: "POST", body: { link: "https://instagram.com/{username}" } },
    // Legacy endpoints for testing
    { url: "/info", method: "POST", body: { username: "{username}" } },
    { url: "/v1/info", method: "POST", body: { username: "{username}" } },
    { url: "/user/info", method: "POST", body: { username: "{username}" } },
  ];

  interface Endpoint {
    url: string;
    method: string;
    body?: { username?: string; link?: string };
  }

  const testEndpoint = async (endpoint: Endpoint) => {
    const url = `https://${apiHost}${endpoint.url}`;

    const options: RequestInit = {
      method: endpoint.method,
      headers: {
        'X-RapidAPI-Key': apiKey,
        'X-RapidAPI-Host': apiHost
      }
    };

    if (endpoint.body) {
      options.headers = {
        ...options.headers,
        'Content-Type': 'application/json'
      };
      // Replace {username} placeholder in body
      const bodyStr = JSON.stringify(endpoint.body).replace(/{username}/g, username);
      options.body = bodyStr;
    }

    try {
      const response = await fetch(url, options);
      const text = await response.text();

      let data: unknown;
      try {
        data = JSON.parse(text);
      } catch {
        data = text;
      }

      return {
        endpoint: endpoint.url,
        method: endpoint.method,
        status: response.status,
        success: response.ok,
        data: data
      };
    } catch (error) {
      return {
        endpoint: endpoint.url,
        method: endpoint.method,
        status: 0,
        success: false,
        data: error instanceof Error ? error.message : String(error)
      };
    }
  };

  const testAllEndpoints = async () => {
    if (!username || !apiKey) {
      alert("Please enter username and API key");
      return;
    }

    setLoading(true);
    setResults([]);

    const testResults = [];
    for (const endpoint of endpoints) {
      const result = await testEndpoint(endpoint);
      testResults.push(result);
      setResults([...testResults]);
    }

    setLoading(false);
  };

  return (
    <div className="container mx-auto p-8 max-w-4xl">
      <h1 className="text-2xl font-bold mb-6">Instagram API Endpoint Tester</h1>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Configuration</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium">Instagram Username</label>
            <Input
              value={username}
              onChange={(e) => setUsername(e.target.value.replace("@", ""))}
              placeholder="username (without @)"
            />
          </div>
          <div>
            <label className="text-sm font-medium">RapidAPI Key</label>
            <Input
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="Your RapidAPI key"
            />
          </div>
          <div>
            <label className="text-sm font-medium">API Host</label>
            <Input
              value={apiHost}
              onChange={(e) => setApiHost(e.target.value)}
              placeholder="instagram120.p.rapidapi.com"
            />
          </div>
          <Button onClick={testAllEndpoints} disabled={loading}>
            {loading ? "Testing..." : "Test All Endpoints"}
          </Button>
        </CardContent>
      </Card>

      <div className="space-y-4">
        {results.map((result, index) => (
          <Card key={index} className={result.success ? "border-green-500" : "border-red-500"}>
            <CardHeader>
              <CardTitle className="text-sm">
                {result.method} {result.endpoint} - Status: {result.status}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="text-xs overflow-auto bg-gray-100 p-2 rounded">
                {typeof result.data === 'object'
                  ? JSON.stringify(result.data, null, 2)
                  : String(result.data)
                }
              </pre>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

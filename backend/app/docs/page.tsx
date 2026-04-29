'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';

const SwaggerUI = dynamic(() => import('swagger-ui-react'), { ssr: false }) as any;
import 'swagger-ui-react/swagger-ui.css';

export default function DocsPage() {
  const [spec, setSpec] = useState<any>(null);

  useEffect(() => {
    fetch('/api/docs')
      .then(res => res.json())
      .then(data => setSpec(data));
  }, []);

  if (!spec) return <div>Loading...</div>;

  return (
    <div style={{ padding: '20px' }}>
      <SwaggerUI spec={spec} />
    </div>
  );
}

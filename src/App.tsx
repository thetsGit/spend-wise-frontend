import { Button } from "@/components/ui/button";
import { useRequest } from "@/hooks";
import { getSaaSDiscoverySummary } from "@/services/saas-services";
import { useEffect } from "react";

function App() {
  const { execute, pending } = useRequest(getSaaSDiscoverySummary);

  useEffect(() => {
    execute({});
  }, []);

  return (
    <>
      {pending ? (
        <p>loading...</p>
      ) : (
        <>
          <p className="text-blue-500 font-bold">Hello world</p>
          <Button>hello</Button>
        </>
      )}
    </>
  );
}

export default App;

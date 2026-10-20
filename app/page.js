import Home from "@/components/Home";

// Event changes revalidate "/" immediately; this is just a safety net
export const revalidate = 600;

export default function page() {
  return (
    <>
      <div className="scroll-smooth">
        <Home />
      </div>

    </>
  );
}

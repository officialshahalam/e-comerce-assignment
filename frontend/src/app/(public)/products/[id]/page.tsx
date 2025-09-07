// app/users/[id]/page.tsx

interface PageProps {
  params: {
    id: string;
  };
}

export default async function UserPage({ params }: PageProps) {
  const { id } = params;

  return (
    <div className="w-screen h-screen flex flex-col gap-4 justify-center items-center">
      <h1>Product ID: {id}</h1>
      <p>I Will show the detail product information</p>
    </div>
  );
}

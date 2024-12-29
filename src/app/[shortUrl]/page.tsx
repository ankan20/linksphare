import AdPage from "@/components/AdPage";
import prisma from "@/lib/prisma";

export default async function ShortUrlRedirect({ params }: { params: { shortUrl: string } }) {
    const { shortUrl } = await params;

    // Fetch the original URL from the database
    const link = await prisma.link.findUnique({
        where: { shortUrl },
    });

    if (link?.originalUrl) {
        // Render the advertisement page
        return <AdPage originalUrl={link.originalUrl} />;
    }

    return (
        <div className="flex items-center justify-center h-screen">
            <h1 className="text-2xl font-bold text-red-500">404 - Link Not Found</h1>
        </div>
    );
}

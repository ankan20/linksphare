import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
  } from "@/components/ui/accordion"
  
  export function Faqs() {
    return (
      <Accordion type="single" collapsible className="w-full">
        <h1>FAQS</h1>
        <AccordionItem value="item-1">
          <AccordionTrigger>How do I add links to my project?</AccordionTrigger>
          <AccordionContent>
          To add links, simply head over to the project details page and click on the &quot;Add Links&quot; section. From there, you can easily add the URLs and organize them with relevant tags!</AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-2">
          <AccordionTrigger>Can I see detailed stats about my links?</AccordionTrigger>
          <AccordionContent>
            Absolutely! You can view detailed information about each link, including the number of clicks, tags, and the original URL. Just visit the project details page, and it&apos;s all laid out for you.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-3">
          <AccordionTrigger>Are there any new features coming soon?</AccordionTrigger>
          <AccordionContent>
            Yes.I am working on that!,you can also suggest me some features that you would like to have.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-4">
          <AccordionTrigger>Is it open-source? Can I contribute?</AccordionTrigger>
          <AccordionContent>
          Yes, it&apos;s open-source! Feel free to check out the code on GitHub. Contributions are always welcome.
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    )
  }
  
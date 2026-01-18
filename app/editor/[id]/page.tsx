import { TemplateEditor } from "@/components/template-editor"

interface EditorPageProps {
  params: Promise<{ id: string }>
}

export default async function EditorPage({ params }: EditorPageProps) {
  const { id } = await params
  return <TemplateEditor templateId={id} />
}

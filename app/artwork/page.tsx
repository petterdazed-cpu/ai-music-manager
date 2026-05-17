import { redirect } from 'next/navigation';

export default function ArtworkPage() {
  // TODO: keep legacy route while Studio becomes the main creative workspace.
  redirect('/studio');
}

import { redirect } from 'next/navigation';

export default function MusicPage() {
  // TODO: keep legacy route while Studio becomes the main creative workspace.
  redirect('/studio');
}

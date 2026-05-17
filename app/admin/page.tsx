'use client';

import { useState, useEffect } from 'react';

export default function Admin() {
  const [headline, setHeadline] = useState("What's the move?");
  const [subheadline, setSubheadline] = useState("Talk to Alex — your AI music manager.");
  const [placeholder, setPlaceholder] = useState("Ask Alex anything about your music career...");
  const [suggestions, setSuggestions] = useState("Help with promotion\nBuild release plan\nArtist strategy\nIndustry outreach");
  const [feedItems, setFeedItems] = useState("New Miami venue looking for emerging live acts\nNordic pop playlists accepting independent submissions\nBerlin indie promoters looking for support acts\nStockholm festivals opening artist applications\nReminder: grant deadlines approaching\nSync opportunities rising for electronic producers\nNew songwriter camp announced in Copenhagen\nAlternative pop playlists gaining traction in Germany\nFestival bookers prioritizing strong live video clips\nMusic supervisors searching for cinematic alt-pop tracks\nNashville country showcases opening new artist slots\nIndependent labels seeking export-ready Nordic acts\nEuropean booking agents preparing spring tour routing\nLatin pop curators active in Miami this month\nTip: refresh your EPK before outreach\nNew sync briefs added for indie electronic producers\nShowcase opportunity announced in London\nStreaming editorial teams focusing on mood-based playlists\nPop publishing contacts added this week\nNew grants for independent creators now open\nArtist residency applications now open in Berlin\nTouring support opportunities expanding in Scandinavia");
  const [logoSize, setLogoSize] = useState(460);
  const [avatarVisible, setAvatarVisible] = useState(true);
  const [statusText, setStatusText] = useState('');

  useEffect(() => {
    const hydrationTimer = window.setTimeout(() => {
      setHeadline(localStorage.getItem('headline') || "What's the move?");
      setSubheadline(localStorage.getItem('subheadline') || "Talk to Alex — your AI music manager.");
      setPlaceholder(localStorage.getItem('placeholder') || "Ask Alex anything about your music career...");
      setSuggestions(localStorage.getItem('suggestions') || "Help with promotion\nBuild release plan\nArtist strategy\nIndustry outreach");
      setFeedItems(localStorage.getItem('feedItems') || "New Miami venue looking for emerging live acts\nNordic pop playlists accepting independent submissions\nStockholm festivals opening artist applications\nReminder: grant deadlines approaching\nSync opportunities rising for electronic producers\nTip: update your EPK before outreach");
      setLogoSize(parseInt(localStorage.getItem('logoSize') || '240'));
      setAvatarVisible(localStorage.getItem('avatarVisible') !== 'false');
    }, 0);

    return () => window.clearTimeout(hydrationTimer);
  }, []);

  const save = () => {
    localStorage.setItem('headline', headline);
    localStorage.setItem('subheadline', subheadline);
    localStorage.setItem('placeholder', placeholder);
    localStorage.setItem('suggestions', suggestions);
    localStorage.setItem('feedItems', feedItems);
    localStorage.setItem('logoSize', logoSize.toString());
    localStorage.setItem('avatarVisible', avatarVisible.toString());
    setStatusText('Saved. Homepage prototype content is updated for this browser.');
  };

  const reset = () => {
    localStorage.clear();
    setHeadline("What's the move?");
    setSubheadline("Talk to Alex — your AI music manager.");
    setPlaceholder("Ask Alex anything about your music career...");
    setSuggestions("Help with promotion\nBuild release plan\nArtist strategy\nIndustry outreach");
    setFeedItems("New Miami venue looking for emerging live acts\nNordic pop playlists accepting independent submissions\nBerlin indie promoters looking for support acts\nStockholm festivals opening artist applications\nReminder: grant deadlines approaching\nSync opportunities rising for electronic producers\nNew songwriter camp announced in Copenhagen\nAlternative pop playlists gaining traction in Germany\nFestival bookers prioritizing strong live video clips\nMusic supervisors searching for cinematic alt-pop tracks\nNashville country showcases opening new artist slots\nIndependent labels seeking export-ready Nordic acts\nEuropean booking agents preparing spring tour routing\nLatin pop curators active in Miami this month\nTip: refresh your EPK before outreach\nNew sync briefs added for indie electronic producers\nShowcase opportunity announced in London\nStreaming editorial teams focusing on mood-based playlists\nPop publishing contacts added this week\nNew grants for independent creators now open\nArtist residency applications now open in Berlin\nTouring support opportunities expanding in Scandinavia");
    setLogoSize(460);
    setAvatarVisible(true);
    setStatusText('Reset complete. AIM restored the default homepage prototype copy.');
  };

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">AIM Homepage Editor</h1>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">Main Headline</label>
            <input
              type="text"
              value={headline}
              onChange={(e) => setHeadline(e.target.value)}
              className="w-full p-3 bg-white/10 border border-white/20 rounded-lg text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Subheadline</label>
            <input
              type="text"
              value={subheadline}
              onChange={(e) => setSubheadline(e.target.value)}
              className="w-full p-3 bg-white/10 border border-white/20 rounded-lg text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Chat Placeholder</label>
            <input
              type="text"
              value={placeholder}
              onChange={(e) => setPlaceholder(e.target.value)}
              className="w-full p-3 bg-white/10 border border-white/20 rounded-lg text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Suggestion Chips (one per line)</label>
            <textarea
              value={suggestions}
              onChange={(e) => setSuggestions(e.target.value)}
              rows={4}
              className="w-full p-3 bg-white/10 border border-white/20 rounded-lg text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Industry Feed Items (one per line)</label>
            <textarea
              value={feedItems}
              onChange={(e) => setFeedItems(e.target.value)}
              rows={6}
              className="w-full p-3 bg-white/10 border border-white/20 rounded-lg text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Logo Size (px)</label>
            <input
              type="number"
              value={logoSize}
              onChange={(e) => setLogoSize(parseInt(e.target.value))}
              className="w-full p-3 bg-white/10 border border-white/20 rounded-lg text-white"
            />
          </div>

          <div>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={avatarVisible}
                onChange={(e) => setAvatarVisible(e.target.checked)}
                className="mr-2"
              />
              Show Avatar
            </label>
          </div>

          <div className="flex gap-4">
            <button
              type="button"
              onClick={save}
              className="px-6 py-3 bg-sky-500 text-white rounded-lg hover:bg-sky-600"
            >
              Save Changes
            </button>
            <button
              type="button"
              onClick={reset}
              className="px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600"
            >
              Reset to Defaults
            </button>
          </div>
          {statusText ? (
            <div className="rounded-2xl border border-sky-400/20 bg-sky-500/10 px-4 py-3 text-sm text-sky-100">
              {statusText}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}

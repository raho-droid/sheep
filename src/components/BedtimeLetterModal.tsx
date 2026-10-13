import React, { useState } from 'react';
import { Heart, Copy, Check, Sparkles, Send } from 'lucide-react';

interface BedtimeLetterProps {
  crushName: string;
  onUpdateCrushName: (name: string) => void;
}

const PRESET_MESSAGES = [
  {
    title: "Sıcak & Romantik",
    text: "Bütün gün aklımdaydın, şimdi de en güzel rüyalarımda olmanı diliyorum. Gözlerini kapatırken seni düşünen, senin için endişelenen ve gülüşünü çok özleyen birinin olduğunu sakın unutma. İyi uykular birtanem... 🌙✨"
  },
  {
    title: "Tatlı & Koruyucu",
    text: "Uyuyamadığını biliyorum ama lütfen kafandaki hiçbir şeyi dert etme. Bugün geride kaldı, yarın çok güzel olacak. Bütün tatlı koyunlar bu gece senin nöbetçilerin olsun. Huzurla uyu, tatlı rüyalar meleğim."
  },
  {
    title: "Eğlenceli & Flörtöz",
    text: "Koyunları saydın saydın hala uyuyamadıysan, son çare olarak rüyana gelip sana ninni söylemem gerekebilir! Şaka bir yana, dünyanın en güzel gözleri artık dinlenmeli. İyi geceler, rüyanda beni görmeyi unutma! 🐑❤️"
  }
];

export const BedtimeLetterModal: React.FC<BedtimeLetterProps> = ({
  crushName,
  onUpdateCrushName,
}) => {
  const [selectedPresetIndex, setSelectedPresetIndex] = useState<number>(0);
  const [customNote, setCustomNote] = useState<string>(PRESET_MESSAGES[0].text);
  const [copied, setCopied] = useState<boolean>(false);

  const handleSelectPreset = (index: number) => {
    setSelectedPresetIndex(index);
    setCustomNote(PRESET_MESSAGES[index].text);
  };

  const handleCopy = () => {
    const fullText = `${crushName ? `${crushName}, ` : ''}${customNote}`;
    navigator.clipboard.writeText(fullText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full max-w-3xl mx-auto py-6 px-4">
      <div className="text-center mb-6">
        <h2 className="text-xl md:text-2xl font-serif-dream text-indigo-100 flex items-center justify-center gap-2">
          <span>Ona Özel İyi Geceler Mektubu</span>
          <Heart className="w-4 h-4 text-rose-400 fill-rose-400" />
        </h2>
        <p className="text-xs md:text-sm text-indigo-300/70 mt-1">
          Flörtüne iyi uykular dileyebileceğin, kalbini ısıtacak tatlı bir mesaj kartı.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch">
        {/* Left Column: Sleepy Baby Sheep Image & Name Setup */}
        <div className="md:col-span-5 flex flex-col gap-4">
          <div className="relative rounded-3xl overflow-hidden border border-indigo-400/20 shadow-xl bg-slate-900 group aspect-square">
            <img
              src="/src/assets/images/cozy_sleepy_sheep_1791928776116.jpg"
              alt="Cozy Sleepy Sheep on Cloud"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
            <div className="absolute bottom-3 inset-x-3 text-center">
              <span className="text-xs font-medium text-indigo-200 bg-indigo-950/60 backdrop-blur-md px-3 py-1 rounded-full border border-indigo-400/20">
                Bulutların üzerinde mışıl mışıl
              </span>
            </div>
          </div>

          {/* Recipient Nickname / Name Input */}
          <div className="bg-indigo-950/40 border border-indigo-500/20 p-3.5 rounded-2xl">
            <label className="block text-xs font-medium text-indigo-300 mb-1.5">
              Hitap Şekli / İsmi:
            </label>
            <input
              type="text"
              value={crushName}
              onChange={(e) => onUpdateCrushName(e.target.value)}
              placeholder="Örn: Güzelim, Canım, Ay Parçam..."
              className="w-full px-3 py-2 rounded-xl bg-indigo-900/40 border border-indigo-400/25 text-white text-sm placeholder-indigo-400/40 focus:outline-none focus:border-indigo-400 transition-colors"
            />
          </div>
        </div>

        {/* Right Column: Letter Card */}
        <div className="md:col-span-7 flex flex-col justify-between bg-gradient-to-br from-[#121633] via-[#0d1228] to-[#151936] border border-indigo-400/30 p-5 md:p-6 rounded-3xl shadow-2xl relative">
          <div>
            {/* Preset Selector */}
            <div className="flex items-center gap-1.5 mb-4 overflow-x-auto pb-1">
              {PRESET_MESSAGES.map((preset, idx) => (
                <button
                  key={preset.title}
                  onClick={() => handleSelectPreset(idx)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all whitespace-nowrap ${
                    selectedPresetIndex === idx
                      ? 'bg-indigo-600 text-white shadow-md'
                      : 'bg-indigo-950/60 text-indigo-300 hover:bg-indigo-900/50'
                  }`}
                >
                  {preset.title}
                </button>
              ))}
            </div>

            {/* Letter Text Area with cozy font */}
            <div className="relative">
              <span className="block text-amber-200/90 font-serif-dream italic text-base mb-1">
                Sevgili {crushName || 'Birtanem'},
              </span>
              <textarea
                value={customNote}
                onChange={(e) => setCustomNote(e.target.value)}
                rows={6}
                className="w-full bg-indigo-950/30 border border-indigo-500/15 rounded-xl p-3 text-indigo-100 text-sm md:text-base leading-relaxed font-serif-dream focus:outline-none focus:border-indigo-400/50 resize-none transition-colors"
                placeholder="Buraya flörtüne göndermek veya ona okutmak istediğin tatlı iyi geceler notunu yazabilirsin..."
              />
            </div>
          </div>

          {/* Action Row */}
          <div className="mt-4 pt-3 border-t border-indigo-500/15 flex items-center justify-between">
            <span className="text-[11px] text-indigo-300/60 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Yatağa girmeden önce iyi hissettirir</span>
            </span>

            <button
              onClick={handleCopy}
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 active:scale-95 text-white text-xs md:text-sm font-medium flex items-center gap-1.5 shadow-md shadow-indigo-950 transition-all"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-emerald-300" />
                  <span>Kopyalandı!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>Notu Kopyala</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

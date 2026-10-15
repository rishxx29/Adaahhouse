import React, { useState } from 'react';
import { X, Ruler, CheckCircle } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { STANDARD_MEASUREMENTS } from '../config/brand';

export const SizeGuideModal: React.FC = () => {
  const { isSizeGuideOpen, setIsSizeGuideOpen } = useStore();
  const [unit, setUnit] = useState<'inches' | 'cm'>('inches');

  if (!isSizeGuideOpen) return null;

  const toCm = (inchStr: string) => {
    const val = parseFloat(inchStr.replace('"', ''));
    return `${Math.round(val * 2.54)} cm`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-[#FAF7F2] max-w-2xl w-full border border-[#C9A76A]/40 shadow-xl overflow-hidden animate-in zoom-in-95 duration-200 max-h-[90vh] flex flex-col">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-[#E8DED2] flex items-center justify-between bg-[#F2ECE1]">
          <div className="flex items-center gap-2">
            <Ruler className="w-5 h-5 text-[#5B1E22]" />
            <h3 className="font-serif text-xl font-bold text-[#292522]">
              ADAAH HOUSE — Kurti Sizing Chart
            </h3>
          </div>
          <button
            onClick={() => setIsSizeGuideOpen(false)}
            className="p-1 text-[#292522] hover:text-[#5B1E22]"
            aria-label="Close size guide"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 overflow-y-auto space-y-6 text-sm">
          {/* Unit Switcher */}
          <div className="flex items-center justify-between">
            <p className="text-xs text-[#292522]/80">
              Garment measurements are taken flat across the garment.
            </p>
            <div className="flex items-center border border-[#E8DED2] bg-white text-xs">
              <button
                onClick={() => setUnit('inches')}
                className={`px-3 py-1 font-medium transition-colors ${
                  unit === 'inches' ? 'bg-[#5B1E22] text-white' : 'text-[#292522] hover:text-[#5B1E22]'
                }`}
              >
                Inches (")
              </button>
              <button
                onClick={() => setUnit('cm')}
                className={`px-3 py-1 font-medium transition-colors ${
                  unit === 'cm' ? 'bg-[#5B1E22] text-white' : 'text-[#292522] hover:text-[#5B1E22]'
                }`}
              >
                Centimeters (cm)
              </button>
            </div>
          </div>

          {/* Measurements Table */}
          <div className="overflow-x-auto border border-[#E8DED2] bg-white">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#5B1E22] text-[#FAF7F2] uppercase tracking-wider font-semibold">
                <tr>
                  <th className="py-2.5 px-3">Size</th>
                  <th className="py-2.5 px-3">Kurti Bust</th>
                  <th className="py-2.5 px-3">Waist</th>
                  <th className="py-2.5 px-3">Hip</th>
                  <th className="py-2.5 px-3">Length</th>
                  <th className="py-2.5 px-3">Shoulder</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E8DED2] font-mono tabular-nums text-[#292522]">
                {(['S', 'M', 'L', 'XL', 'XXL'] as const).map((sz, idx) => {
                  const m = STANDARD_MEASUREMENTS[sz];
                  return (
                    <tr key={sz} className={idx % 2 === 0 ? 'bg-white' : 'bg-[#FAF7F2]/60'}>
                      <td className="py-2.5 px-3 font-sans font-bold text-[#5B1E22]">{sz}</td>
                      <td className="py-2.5 px-3">{unit === 'inches' ? m.bust : toCm(m.bust)}</td>
                      <td className="py-2.5 px-3">{unit === 'inches' ? m.waist : toCm(m.waist)}</td>
                      <td className="py-2.5 px-3">{unit === 'inches' ? m.hip : toCm(m.hip)}</td>
                      <td className="py-2.5 px-3">{unit === 'inches' ? m.length : toCm(m.length)}</td>
                      <td className="py-2.5 px-3">{unit === 'inches' ? m.shoulder : toCm(m.shoulder || '15"')}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* How to Measure Guidelines */}
          <div className="bg-[#FAF7F2] p-4 border border-[#E8DED2] space-y-2">
            <h4 className="font-serif text-sm font-semibold text-[#5B1E22] flex items-center gap-1.5">
              <CheckCircle className="w-4 h-4 text-[#C9A76A]" />
              <span>How to Measure Your Best Fit</span>
            </h4>
            <ul className="text-xs text-[#292522]/80 space-y-1.5 list-disc pl-4 font-normal">
              <li>
                <strong>Bust:</strong> Measure around the fullest part of your chest with a tape held comfortably level.
              </li>
              <li>
                <strong>Waist:</strong> Measure around the natural waistline where your trousers or salwars typically rest.
              </li>
              <li>
                <strong>Hip:</strong> Measure around the widest part of your hips/thighs.
              </li>
              <li>
                <strong>Kurti Fit Tip:</strong> If your body measurement falls between two sizes, we recommend sizing up for traditional Indian ethnic comfort and graceful drape.
              </li>
            </ul>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 border-t border-[#E8DED2] bg-[#F2ECE1] flex justify-end">
          <button
            onClick={() => setIsSizeGuideOpen(false)}
            className="px-6 py-2 bg-[#5B1E22] text-[#FAF7F2] text-xs uppercase tracking-wider font-semibold hover:bg-[#421417] transition-colors"
          >
            Got It
          </button>
        </div>
      </div>
    </div>
  );
};

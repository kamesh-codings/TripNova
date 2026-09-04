import React, { useState } from 'react';
import { 
  Scale, 
  CheckCircle2, 
  Car, 
  ShieldAlert, 
  Volume2, 
  Info,
  TrendingDown
} from 'lucide-react';
import { VEHICLE_FARE_BENCHMARKS } from '../data/mockData';
import { speakPhrase } from '../utils/speech';

export const AntiScamEstimator: React.FC = () => {
  const [distanceKm, setDistanceKm] = useState<number>(3.5);
  const [selectedVehicle, setSelectedVehicle] = useState<string>('Auto-Rickshaw (3-Wheeler)');
  const [isNightTime, setIsNightTime] = useState<boolean>(false);
  const [quotedFare, setQuotedFare] = useState<string>('500');
  const [selectedLang, setSelectedLang] = useState<'Tamil' | 'Hindi' | 'English'>('Tamil');

  const benchmark = VEHICLE_FARE_BENCHMARKS.find(v => v.vehicleType === selectedVehicle) || VEHICLE_FARE_BENCHMARKS[0];

  const calculateFairFare = () => {
    let base = benchmark.baseFare;
    let extraKm = Math.max(0, distanceKm - 1.5);
    let total = base + (extraKm * benchmark.ratePerKm);
    
    if (isNightTime) {
      total = total * benchmark.nightSurchargeMultiplier;
    }

    const minFair = Math.round(Math.max(benchmark.minimumFare, total * 0.95));
    const maxFair = Math.round(Math.max(benchmark.minimumFare + 15, total * 1.15));
    const expected = Math.round(total);

    return { minFair, maxFair, expected };
  };

  const { minFair, maxFair, expected } = calculateFairFare();
  const driverQuoteNum = parseFloat(quotedFare) || 0;
  const isOvercharging = driverQuoteNum > maxFair;
  const excessAmount = driverQuoteNum > maxFair ? driverQuoteNum - expected : 0;
  const scamMultiplier = expected > 0 ? (driverQuoteNum / expected).toFixed(1) : '1.0';

  const getBargainPhrase = () => {
    const suggestedOffer = maxFair;
    return {
      english: `Excuse me, the government meter rate for ${distanceKm} km is around ₹${expected}. I can pay ₹${suggestedOffer}, please turn on the meter.`,
      tamil: `சார், ${distanceKm} கி.மீ-க்கு அரசு கட்டணம் ₹${expected} தான். நான் அதிகபட்சமாக ₹${suggestedOffer} தருகிறேன், மீட்டர் போடுங்கள்.`,
      hindi: `सर, ${distanceKm} किमी के लिए सरकारी दर लगभग ₹${expected} है। मैं ₹${suggestedOffer} दे सकता हूँ, कृपया मीटर चालू करें।`
    };
  };

  const phrase = getBargainPhrase();

  const handleSpeakPhrase = () => {
    const text = selectedLang === 'Tamil' ? phrase.tamil : selectedLang === 'Hindi' ? phrase.hindi : phrase.english;
    speakPhrase(text, selectedLang);
  };

  return (
    <div className="animate-fade" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Top Banner */}
      <div className="glass-panel" style={{
        padding: '20px',
        background: 'linear-gradient(90deg, rgba(120, 53, 15, 0.4) 0%, rgba(15, 23, 42, 0.9) 100%)',
        borderColor: 'rgba(245, 158, 11, 0.3)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '16px'
      }}>
        <div className="flex items-center gap-3">
          <div style={{
            width: '44px',
            height: '44px',
            borderRadius: '14px',
            background: 'rgba(245, 158, 11, 0.2)',
            border: '1px solid rgba(245, 158, 11, 0.4)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0
          }}>
            <Scale style={{ width: '24px', height: '24px', color: '#fbbf24' }} />
          </div>
          <div>
            <h2 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#ffffff', display: 'flex', alignItems: 'center', gap: '8px' }}>
              Fare Guard: Anti-Scam Travel Expense Estimator
              <span className="badge badge-amber">Real-Time Fair Rate</span>
            </h2>
            <p style={{ fontSize: '0.78rem', color: '#cbd5e1' }}>
              Avoid transport overcharging. Check verified government & app tariffs before boarding autos, taxis, and cabs.
            </p>
          </div>
        </div>

        <div style={{ padding: '8px 14px', background: 'rgba(10, 15, 29, 0.8)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.06)', fontSize: '0.75rem', color: '#cbd5e1' }}>
          <span style={{ color: '#38bdf8', fontWeight: 700 }}>Scam Example:</span> Driver demands ₹2,000 for 2km $\rightarrow$ Fair fare is ₹50 - ₹120.
        </div>
      </div>

      <div className="grid grid-12 gap-5">
        {/* Left 6 cols: Calculator Inputs */}
        <div className="col-span-6 lg-col-span-12" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div className="glass-panel" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <h3 style={{ fontSize: '0.92rem', fontWeight: 800, color: '#ffffff', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Car style={{ width: '18px', height: '18px', color: '#38bdf8' }} />
              1. Trip Distance & Vehicle Type
            </h3>

            {/* Distance Input */}
            <div>
              <div className="flex justify-between" style={{ fontSize: '0.78rem', fontWeight: 700, color: '#cbd5e1', marginBottom: '6px' }}>
                <span>Trip Distance (Kilometers):</span>
                <span style={{ color: '#38bdf8', fontFamily: 'monospace', fontSize: '0.95rem', fontWeight: 800 }}>{distanceKm} KM</span>
              </div>
              <input
                type="range"
                min="0.5"
                max="50"
                step="0.5"
                value={distanceKm}
                onChange={e => setDistanceKm(parseFloat(e.target.value))}
                style={{ width: '100%', height: '8px', borderRadius: '4px', background: '#1e293b', accentColor: '#38bdf8', cursor: 'pointer' }}
              />
              <div className="flex justify-between" style={{ fontSize: '0.7rem', color: '#64748b', marginTop: '4px' }}>
                <span>0.5 km (Short)</span>
                <span>15 km (City)</span>
                <span>50 km (Outstation)</span>
              </div>
            </div>

            {/* Vehicle Type Selection */}
            <div>
              <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#cbd5e1', display: 'block', marginBottom: '8px' }}>
                Select Transport Type:
              </label>
              <div className="grid grid-2 gap-2">
                {VEHICLE_FARE_BENCHMARKS.map(v => (
                  <button
                    key={v.vehicleType}
                    type="button"
                    onClick={() => setSelectedVehicle(v.vehicleType)}
                    className="btn-secondary"
                    style={{
                      padding: '10px 12px',
                      textAlign: 'left',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'flex-start',
                      background: selectedVehicle === v.vehicleType ? 'rgba(56, 189, 248, 0.15)' : 'rgba(10, 15, 29, 0.7)',
                      borderColor: selectedVehicle === v.vehicleType ? '#38bdf8' : 'rgba(255,255,255,0.06)'
                    }}
                  >
                    <span style={{ fontSize: '0.78rem', fontWeight: 800, color: '#ffffff' }}>{v.vehicleType}</span>
                    <span style={{ fontSize: '0.68rem', color: '#94a3b8' }}>Base: ₹{v.baseFare} • ₹{v.ratePerKm}/km</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Night Surcharge Switch */}
            <div style={{ padding: '12px 14px', background: 'rgba(10, 15, 29, 0.75)', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <strong style={{ fontSize: '0.8rem', color: '#ffffff', display: 'block' }}>Night Travel (11:00 PM - 5:00 AM)</strong>
                <span style={{ fontSize: '0.7rem', color: '#94a3b8' }}>Applies 1.25x - 1.5x standard night tariff</span>
              </div>
              <button
                type="button"
                onClick={() => setIsNightTime(!isNightTime)}
                style={{
                  width: '44px',
                  height: '24px',
                  borderRadius: '12px',
                  background: isNightTime ? '#4f46e5' : '#334155',
                  border: 'none',
                  position: 'relative',
                  cursor: 'pointer',
                  padding: '2px',
                  transition: 'all 0.2s'
                }}
              >
                <div style={{
                  width: '20px',
                  height: '20px',
                  borderRadius: '50%',
                  background: '#ffffff',
                  transform: isNightTime ? 'translateX(20px)' : 'translateX(0)',
                  transition: 'all 0.2s'
                }} />
              </button>
            </div>

            {/* Driver Quote Input */}
            <div style={{ paddingTop: '8px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
              <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#cbd5e1', display: 'block', marginBottom: '6px' }}>
                What fare did the driver or agent quote? (₹ INR)
              </label>
              <input
                type="number"
                value={quotedFare}
                onChange={e => setQuotedFare(e.target.value)}
                placeholder="e.g. 500"
                className="input-glass"
                style={{ fontFamily: 'monospace', fontSize: '1rem', fontWeight: 800, color: '#fbbf24' }}
              />
            </div>
          </div>
        </div>

        {/* Right 6 cols: Fair Fare Verdict & Counter Bargain */}
        <div className="col-span-6 lg-col-span-12" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Main Comparison Card */}
          <div className="glass-panel" style={{
            padding: '20px',
            border: isOvercharging && excessAmount > 100 ? '2px solid rgba(239, 68, 68, 0.6)' : '2px solid rgba(16, 185, 129, 0.5)',
            background: isOvercharging && excessAmount > 100 
              ? 'linear-gradient(135deg, rgba(88, 28, 28, 0.4) 0%, rgba(15, 23, 42, 0.95) 100%)' 
              : 'linear-gradient(135deg, rgba(6, 78, 59, 0.3) 0%, rgba(15, 23, 42, 0.95) 100%)'
          }}>
            <div className="flex items-center justify-between" style={{ marginBottom: '16px' }}>
              <div className="flex items-center gap-2">
                {isOvercharging && excessAmount > 100 ? (
                  <ShieldAlert style={{ width: '24px', height: '24px', color: '#f87171' }} />
                ) : (
                  <CheckCircle2 style={{ width: '24px', height: '24px', color: '#34d399' }} />
                )}
                <div>
                  <h3 style={{ fontSize: '1rem', fontWeight: 900, color: '#ffffff' }}>
                    {isOvercharging && excessAmount > 100 ? '🚨 OVERCHARGING SCAM DETECTED' : '✅ FAIR FARE RANGE'}
                  </h3>
                  <p style={{ fontSize: '0.72rem', color: '#cbd5e1' }}>
                    {isOvercharging ? `Driver is quoting ${scamMultiplier}x higher than standard rate!` : 'Quoted fare is reasonable for this distance.'}
                  </p>
                </div>
              </div>
              <span className={`badge ${isOvercharging ? 'badge-red' : 'badge-green'}`}>
                {isOvercharging ? `${scamMultiplier}x Surge` : 'Reasonable'}
              </span>
            </div>

            {/* Numbers Display */}
            <div className="grid grid-2 gap-3" style={{ marginBottom: '16px' }}>
              <div style={{ padding: '14px', background: 'rgba(10, 15, 29, 0.85)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.06)' }}>
                <span style={{ fontSize: '0.68rem', textTransform: 'uppercase', fontWeight: 800, color: '#94a3b8', display: 'block' }}>Actual Fair Cost</span>
                <span style={{ fontSize: '1.6rem', fontWeight: 900, color: '#34d399', fontFamily: 'monospace' }}>₹{expected}</span>
                <p style={{ fontSize: '0.7rem', color: '#94a3b8' }}>Range: ₹{minFair} - ₹{maxFair}</p>
              </div>

              <div style={{ padding: '14px', background: 'rgba(10, 15, 29, 0.85)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.06)' }}>
                <span style={{ fontSize: '0.68rem', textTransform: 'uppercase', fontWeight: 800, color: '#94a3b8', display: 'block' }}>Driver Quoted</span>
                <span style={{ fontSize: '1.6rem', fontWeight: 900, fontFamily: 'monospace', color: isOvercharging ? '#f87171' : '#ffffff' }}>
                  ₹{driverQuoteNum || 0}
                </span>
                <p style={{ fontSize: '0.7rem', fontWeight: 700, color: excessAmount > 0 ? '#f87171' : '#94a3b8' }}>
                  {excessAmount > 0 ? `Overcharging by +₹${excessAmount}` : 'Within fair range'}
                </p>
              </div>
            </div>

            {/* Smart Counter-Offer */}
            <div style={{ padding: '14px', background: 'rgba(15, 23, 42, 0.95)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.08)', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div className="flex items-center justify-between">
                <span style={{ fontSize: '0.78rem', fontWeight: 800, color: '#38bdf8', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <TrendingDown style={{ width: '16px', height: '16px' }} />
                  Smart Counter-Bargain Script
                </span>
                <div className="flex gap-1">
                  {(['Tamil', 'Hindi', 'English'] as const).map(l => (
                    <button
                      key={l}
                      onClick={() => setSelectedLang(l)}
                      style={{
                        padding: '2px 6px',
                        borderRadius: '4px',
                        fontSize: '0.65rem',
                        fontWeight: 800,
                        border: 'none',
                        cursor: 'pointer',
                        background: selectedLang === l ? '#38bdf8' : '#1e293b',
                        color: selectedLang === l ? '#0f172a' : '#94a3b8'
                      }}
                    >
                      {l}
                    </button>
                  ))}
                </div>
              </div>

              <p style={{ fontSize: '0.78rem', color: '#f8fafc', fontStyle: 'italic', background: 'rgba(10, 15, 29, 0.8)', padding: '10px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.05)' }}>
                "{selectedLang === 'Tamil' ? phrase.tamil : selectedLang === 'Hindi' ? phrase.hindi : phrase.english}"
              </p>

              <button
                onClick={handleSpeakPhrase}
                className="btn-secondary"
                style={{ width: '100%', padding: '8px', fontSize: '0.78rem', color: '#38bdf8', justifyContent: 'center' }}
              >
                <Volume2 style={{ width: '15px', height: '15px' }} /> Speak aloud to driver ({selectedLang})
              </button>
            </div>
          </div>

          {/* Quick Scam Avoidance Tips */}
          <div className="glass-panel" style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <h4 style={{ fontSize: '0.82rem', fontWeight: 800, color: '#ffffff', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Info style={{ width: '15px', height: '15px', color: '#38bdf8' }} />
              Golden Rules for Safe Tourist Commute
            </h4>
            <ul style={{ paddingLeft: '18px', fontSize: '0.75rem', color: '#94a3b8', lineHeight: 1.6 }}>
              <li>Never board without agreeing on fixed price or turning on meter first.</li>
              <li>Refuse if driver claims destination is "closed for festival" to redirect you.</li>
              <li>At railway junctions and airports, always head to the official <strong>Pre-Paid Taxi/Auto Counter</strong>.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

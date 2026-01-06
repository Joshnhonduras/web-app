/* eslint-disable react-hooks/set-state-in-effect */
import { useState, useEffect } from 'react';
import { getModelsForProvider, formatPricing, type ModelInfo } from '../../../lib/modelCatalog';
import './ModelSelector.css';

interface ModelSelectorProps {
  provider: 'openrouter' | 'openai' | 'groq' | null;
  selectedModel?: string;
  onSelect: (modelId: string) => void;
}

export default function ModelSelector({ provider, selectedModel, onSelect }: ModelSelectorProps) {
  const [models, setModels] = useState<ModelInfo[]>([]);
  const [loading, setLoading] = useState(false);
  const [showFreeOnly, setShowFreeOnly] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!provider) {
      setModels([]);
      setError(null);
      return;
    }

    setLoading(true);
    setError(null);
    getModelsForProvider(provider)
      .then(setModels)
      .catch((err) => {
        console.error('Model fetch failed', err);
        setError('Failed to load models. Try again or select another provider.');
      })
      .finally(() => setLoading(false));
  }, [provider]);

  if (!provider) {
    return (
      <div>
        <p className="text-sm text-[#b8b5b0]">Select a provider first</p>
      </div>
    );
  }

  const filteredModels = showFreeOnly && provider === 'openrouter'
    ? models.filter(m => m.free)
    : models;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="block text-sm font-medium">Model</label>
        {provider === 'openrouter' && models.length > 0 && (
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="free-only"
              checked={showFreeOnly}
              onChange={(e) => setShowFreeOnly(e.target.checked)}
              className="w-4 h-4"
            />
            <label htmlFor="free-only" className="text-xs text-[#b8b5b0]">Show free models only</label>
          </div>
        )}
      </div>

      {loading && <div className="text-sm text-[#b8b5b0]">Loading models...</div>}
      {!loading && error && (
        <div className="bg-red-900/20 border border-red-700/50 rounded-lg p-3 text-red-200 text-sm">
          {error}
        </div>
      )}
      {!loading && !error && filteredModels.length === 0 && (
        <div className="text-sm text-[#b8b5b0]">No models available</div>
      )}
      {!loading && !error && filteredModels.length > 0 && (
        <select 
          value={selectedModel || ''} 
          onChange={(e) => onSelect(e.target.value)}
          className="w-full bg-[#222222] border border-[#2a2a2a] rounded-lg px-4 py-2 text-[#e8e6e3] hover:border-[#3a3a3a] transition-colors appearance-none cursor-pointer"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%238b7355' d='M6 9L1 4h10z'/%3E%3C/svg%3E")`,
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'right 0.75rem center',
            paddingRight: '2.5rem'
          }}
        >
          <option value="" style={{ color: '#e8e6e3', backgroundColor: '#222222' }}>-- Select a model --</option>
          {filteredModels.map((model) => (
            <option key={model.id} value={model.id} style={{ color: '#e8e6e3', backgroundColor: '#222222' }}>
              {model.name}
            </option>
          ))}
        </select>
      )}

      {selectedModel && (
        <div className="bg-[#222222] border border-[#2a2a2a] rounded-lg p-4 space-y-2">
          {(() => {
            const model = models.find(m => m.id === selectedModel);
            if (!model) return null;
            
            return (
              <>
                <div className="text-sm">
                  <strong className="text-[#e8e6e3]">Context Length:</strong>
                  <span className="text-[#b8b5b0] ml-2">{model.contextLength?.toLocaleString() || 'Unknown'} tokens</span>
                </div>
                {model.pricing && (
                  <div className="text-sm">
                    <strong className="text-[#e8e6e3]">Pricing:</strong>
                    <span className="text-[#b8b5b0] ml-2">{formatPricing(model.pricing)}</span>
                  </div>
                )}
                {model.free && (
                  <div className="inline-block mt-2 px-3 py-1 bg-[#8b7355]/10 border border-[#8b7355]/50 rounded text-[#8b7355] text-xs font-medium">
                    ✨ FREE MODEL
                  </div>
                )}
              </>
            );
          })()}
        </div>
      )}

      {provider === 'groq' && (
        <div className="bg-[#222222] border border-[#2a2a2a] rounded-lg p-3 text-sm">
          <strong className="text-[#e8e6e3]">🚀 Groq:</strong>
          <span className="text-[#b8b5b0] ml-2">All models are FREE with generous rate limits!</span>
        </div>
      )}

      {provider === 'openrouter' && showFreeOnly && (
        <div className="bg-yellow-900/20 border border-yellow-700/50 rounded-lg p-3 text-yellow-200 text-sm">
          <strong>⚠️ Important:</strong> Free OpenRouter models require enabling data sharing in{' '}
          <a href="https://openrouter.ai/settings/privacy" target="_blank" rel="noopener" className="underline hover:no-underline">
            Privacy Settings
          </a>
          . If you get "No endpoints found" error, check your privacy settings or use Groq instead.
        </div>
      )}

      {provider === 'openrouter' && !showFreeOnly && (
        <div className="bg-[#222222] border border-[#2a2a2a] rounded-lg p-3 text-sm">
          <strong className="text-[#e8e6e3]">💡 Tip:</strong>
          <span className="text-[#b8b5b0] ml-2">Check "Show free models only" for zero-cost options</span>
        </div>
      )}
    </div>
  );
}

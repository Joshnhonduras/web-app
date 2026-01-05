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
      <div className="model-selector">
        <p className="select-provider-hint">Select a provider first</p>
      </div>
    );
  }

  const filteredModels = showFreeOnly && provider === 'openrouter'
    ? models.filter(m => m.free)
    : models;

  return (
    <div className="model-selector">
      <div className="model-selector-header">
        <label>Model</label>
        {provider === 'openrouter' && models.length > 0 && (
          <div className="free-filter">
            <input
              type="checkbox"
              id="free-only"
              checked={showFreeOnly}
              onChange={(e) => setShowFreeOnly(e.target.checked)}
            />
            <label htmlFor="free-only">Show free models only</label>
          </div>
        )}
      </div>

      {loading && <div className="loading-models">Loading models...</div>}
      {!loading && error && <div className="alert alert-error">{error}</div>}
      {!loading && !error && filteredModels.length === 0 && (
        <div className="no-models">No models available</div>
      )}
      {!loading && !error && filteredModels.length > 0 && (
        <select 
          value={selectedModel || ''} 
          onChange={(e) => onSelect(e.target.value)}
          className="model-select"
        >
          <option value="">-- Select a model --</option>
          {filteredModels.map((model) => (
            <option key={model.id} value={model.id}>
              {model.name}
            </option>
          ))}
        </select>
      )}

      {selectedModel && (
        <div className="model-info">
          {(() => {
            const model = models.find(m => m.id === selectedModel);
            if (!model) return null;
            
            return (
              <>
                <div className="model-detail">
                  <strong>Context Length:</strong> {model.contextLength?.toLocaleString() || 'Unknown'} tokens
                </div>
                {model.pricing && (
                  <div className="model-detail">
                    <strong>Pricing:</strong> {formatPricing(model.pricing)}
                  </div>
                )}
                {model.free && (
                  <div className="free-badge-large">✨ FREE MODEL</div>
                )}
              </>
            );
          })()}
        </div>
      )}

      {provider === 'groq' && (
        <div className="provider-note groq">
          <strong>🚀 Groq:</strong> All models are FREE with generous rate limits!
        </div>
      )}

      {provider === 'openrouter' && showFreeOnly && (
        <div className="provider-note warning">
          <strong>⚠️ Important:</strong> Free OpenRouter models require enabling data sharing in{' '}
          <a href="https://openrouter.ai/settings/privacy" target="_blank" rel="noopener">
            Privacy Settings
          </a>
          . If you get "No endpoints found" error, check your privacy settings or use Groq instead.
        </div>
      )}

      {provider === 'openrouter' && !showFreeOnly && (
        <div className="provider-note openrouter">
          <strong>💡 Tip:</strong> Check "Show free models only" for zero-cost options
        </div>
      )}
    </div>
  );
}

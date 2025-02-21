import React, { ChangeEvent } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../../shared/redux/rootStore'
import { setTemplateField, refineTemplate } from '../state/slices/templateSlice'
import MarkdownRenderer from './MarkdownRenderer'
import Textarea from './Textarea'

const TemplatePanel: React.FC = () => {
  const dispatch = useDispatch()
  const {
    purpose,
    functionality,
    data,
    design,
    integration,
    refinedResponse,
    loading,
    error
  } = useSelector((state: RootState) => state.template)

  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = e.target
    dispatch(setTemplateField({ field: name, value }))
  }

  const handleSubmit = () => {
    dispatch(
      refineTemplate({ purpose, functionality, data, design, integration })
    )
  }

  return (
    <div className="w-full h-full p-4 border-l border-base-300">
      <h2 className="text-3xl font-bold text-gray-900 mb-4">Template</h2>

      <div className="form-control mb-4">
        <label className="label">
          <span className="label-text text-lg text-gray-900 font-semibold">
            Purpose
          </span>
        </label>
        <Textarea
          name="purpose"
          placeholder="Enter purpose here..."
          value={purpose}
          onChange={handleChange}
        />
      </div>

      <div className="form-control mb-4">
        <label className="label">
          <span className="label-text text-lg text-gray-900 font-semibold">
            Functionality
          </span>
        </label>
        <Textarea
          name="functionality"
          placeholder="Enter functionality details..."
          value={functionality}
          onChange={handleChange}
        />
      </div>

      <div className="form-control mb-4">
        <label className="label">
          <span className="label-text text-lg text-gray-900 font-semibold">
            Data
          </span>
        </label>
        <Textarea
          name="data"
          placeholder="Enter data details..."
          value={data}
          onChange={handleChange}
        />
      </div>

      <div className="form-control mb-4">
        <label className="label">
          <span className="label-text text-lg text-gray-900 font-semibold">
            Design
          </span>
        </label>
        <Textarea
          name="design"
          placeholder="Enter design details..."
          value={design}
          onChange={handleChange}
        />
      </div>

      <div className="form-control mb-4">
        <label className="label">
          <span className="label-text text-lg text-gray-900 font-semibold">
            Integration
          </span>
        </label>
        <Textarea
          name="integration"
          placeholder="Enter integration details..."
          value={integration}
          onChange={handleChange}
        />
      </div>

      <button
        className="btn btn-primary"
        onClick={handleSubmit}
        disabled={loading}
      >
        {loading ? 'Submitting...' : 'Submit'}
      </button>

      {error && <p className="text-red-600 mt-2">{error}</p>}

      {refinedResponse && (
        <div className="mt-4">
          <MarkdownRenderer content={refinedResponse} />
        </div>
      )}
    </div>
  )
}

export default TemplatePanel

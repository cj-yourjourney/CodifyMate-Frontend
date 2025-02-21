// templates/components/TemplatePanel.tsx
import React, { ChangeEvent } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../../shared/redux/rootStore'
import { setTemplateField, refineTemplate } from '../state/slices/templateSlice'

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
    <div className="w-full h-full p-4 border-l border-base-300 bg-base-200">
      <h2 className="text-xl font-semibold mb-4">Template</h2>

      <div className="form-control mb-4">
        <label className="label">
          <span className="label-text">Purpose</span>
        </label>
        <textarea
          name="purpose"
          className="textarea textarea-bordered"
          placeholder="Enter purpose here..."
          value={purpose}
          onChange={handleChange}
        ></textarea>
      </div>

      <div className="form-control mb-4">
        <label className="label">
          <span className="label-text">Functionality</span>
        </label>
        <textarea
          name="functionality"
          className="textarea textarea-bordered"
          placeholder="Enter functionality details..."
          value={functionality}
          onChange={handleChange}
        ></textarea>
      </div>

      <div className="form-control mb-4">
        <label className="label">
          <span className="label-text">Data</span>
        </label>
        <textarea
          name="data"
          className="textarea textarea-bordered"
          placeholder="Enter data details..."
          value={data}
          onChange={handleChange}
        ></textarea>
      </div>

      <div className="form-control mb-4">
        <label className="label">
          <span className="label-text">Design</span>
        </label>
        <textarea
          name="design"
          className="textarea textarea-bordered"
          placeholder="Enter design details..."
          value={design}
          onChange={handleChange}
        ></textarea>
      </div>

      <div className="form-control mb-4">
        <label className="label">
          <span className="label-text">Integration</span>
        </label>
        <textarea
          name="integration"
          className="textarea textarea-bordered"
          placeholder="Enter integration details..."
          value={integration}
          onChange={handleChange}
        ></textarea>
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
        <div className="mt-4 p-2 bg-green-100 rounded">{refinedResponse}</div>
      )}
    </div>
  )
}

export default TemplatePanel

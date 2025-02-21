import React from 'react'

const TemplatePanel: React.FC = () => {
  return (
    <div className="w-full h-full p-4 border-l border-base-300 bg-base-200">
      <h2 className="text-xl font-semibold mb-4">Template</h2>
      <div className="form-control mb-4">
        <label className="label">
          <span className="label-text">Purpose</span>
        </label>
        <textarea
          className="textarea textarea-bordered"
          placeholder="Enter purpose here..."
        ></textarea>
      </div>
      <div className="form-control mb-4">
        <label className="label">
          <span className="label-text">User Case</span>
        </label>
        <textarea
          className="textarea textarea-bordered"
          placeholder="Enter user case details..."
        ></textarea>
      </div>
      <div className="form-control mb-4">
        <label className="label">
          <span className="label-text">Data</span>
        </label>
        <textarea
          className="textarea textarea-bordered"
          placeholder="Enter data details..."
        ></textarea>
      </div>
      <button className="btn btn-primary">Submit</button>
    </div>
  )
}

export default TemplatePanel

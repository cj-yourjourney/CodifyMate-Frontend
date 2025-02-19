import React from 'react'

interface ModalContainerProps {
  isOpen: boolean
  onClose: () => void
  title: string
  children: React.ReactNode
  onSubmit?: (e: React.FormEvent<HTMLFormElement>) => void
  loading?: boolean
}

const ModalContainer: React.FC<ModalContainerProps> = ({
  isOpen,
  onClose,
  title,
  children,
  onSubmit,
  loading = false
}) => {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-amber-50 border border-amber-600 rounded-2xl shadow-2xl p-8 w-full max-w-4xl max-h-screen overflow-y-auto">
        <h3 className="text-3xl font-extrabold text-amber-900 mb-6 tracking-wide border-b-4 border-amber-600 pb-2">
          {title}
        </h3>
        <form onSubmit={onSubmit}>
          {children}
          <div className="flex justify-end mt-6 gap-4">
            <button
              type="button"
              className="px-6 py-3 text-lg font-semibold text-gray-800 bg-gray-200 rounded-lg shadow-md hover:bg-gray-300 transition-all"
              onClick={onClose}
              disabled={loading}
            >
              Close
            </button>
            <button
              type="submit"
              disabled={loading}
              className={`px-6 py-3 text-lg font-semibold text-white rounded-lg shadow-md transition-all ${
                loading
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-amber-600 hover:bg-amber-700'
              }`}
            >
              {loading ? (
                <span className="loading loading-dots loading-sm"></span>
              ) : (
                'Submit'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default ModalContainer

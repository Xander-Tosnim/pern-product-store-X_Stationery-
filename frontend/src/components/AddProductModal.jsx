import React from 'react'
import { useProductStore } from '../store/useProductStore';
import { Package2Icon, DollarSignIcon, ImageIcon, PlusCircleIcon } from 'lucide-react';

function AddProductModal() {
  const { addProduct, formData, setFormData, loading } = useProductStore();
  return (
    <dialog id="add_product_modal" className="modal">
        <div className="modal-box">
            {/* Close Button */}
            <form method="dialog">
                <button className="btn btn-circle btn-sm btn-ghost absolute right-2 top-2">X</button>
            </form>
            {/* Modal Header */}
            <h3 className="font-bold text-xl mb-8">Add New Product</h3>
            {/* Form */}
            <form onSubmit={addProduct} className="space-y-6">
              <div className="grid gap-6">
                {/* Name Input */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text text-base font-medium pl-2 pb-1">Product Name</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-base-content/50">
                      <Package2Icon className="size-5 z-10"/>
                    </div>
                    <input type="text" placeholder="Enter Product Name" className="input input-bordered w-full pl-10 py-3 focus:input-primary transition-colors duration-200" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })}/>
                  </div>
                </div>
                {/* Price Input */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text text-base font-medium pl-2 pb-1">Price</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-base-content/50">
                      <DollarSignIcon className="size-5 z-10"/>
                    </div>
                    <input type="number" placeholder="0.00" min="0" step="0.01" className="input input-bordered w-full pl-10 py-3 focus:input-primary transition-colors duration-200" value={formData.price} onChange={(e) => setFormData({ ...formData, price: e.target.value })}/>
                  </div>
                </div>
                {/* Product Image */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text text-base font-medium pl-2 pb-1">Image URL</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-base-content/50">
                      <ImageIcon className="size-5 z-10"/>
                    </div>
                    <input type="text" placeholder="Enter Image URL" className="input input-bordered w-full pl-10 py-3 focus:input-primary transition-colors duration-200" value={formData.image} onChange={(e) => setFormData({ ...formData, image: e.target.value })} />
                  </div>
                </div>
              </div>
              {/* Modal Actions */}
              <div className="modal-action">
                <form method="dialog">
                  <button className="btn btn-ghost">Cancel</button>
                </form>
                <button type="submit" className="btn btn-primary min-w-[120px]" disabled={!formData.name || !formData.price || !formData.image || loading}>
                  {loading ? (<span className="loading loading-spinner loading" />) : (<><PlusCircleIcon className="size-5 mr-2"/>Add Product</>)}
                </button>
              </div>
            </form>
        </div>
        {/* Backdrop */}
        <form method="dialog" className="modal-backdrop">
            <button>close</button>
        </form>
    </dialog>
  )
}

export default AddProductModal;
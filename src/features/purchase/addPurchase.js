import React, { useState, useEffect } from 'react';
import axios from 'axios';
import TitleCard from '../../components/Cards/TitleCard';
import Modal from '../../components/Modal';

const AddPurchaseForm = () => {
  // States for form fields
  const [vendorList, setVendorList] = useState([]);
  const [categoryList, setCategoryList] = useState([]);
  const [vendorId, setVendorId] = useState('');
  const [itemId, setItemId] = useState('');
  const [amount, setAmount] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [expirationDate, setExpirationDate] = useState('');
  const [date, setDate] = useState('');
  const [itemCategoryId, setItemCategoryId] = useState('');

  const [modalOpen, setModalOpen] = useState(false);
  const [messageType, setMessageType] = useState('success');
  const [message, setMessage] = useState('');
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    axios.get('https://apartment.houseethiopia.com/api/vendors')
      .then(response => {
        setVendorList(response.data);
        console.log(response.data);
      })
      .catch(err => {
        setError('Failed to load vendors');
      });
    axios.get('https://apartment.houseethiopia.com/api/item-types')
      .then(response => {
        setCategoryList(response.data);
      })
      .catch(err => {
        setError('Failed to load item categories');
      });
  }, []);
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!vendorId || !itemId || !amount || !price || !description || !expirationDate || !date || !itemCategoryId) {
      setError('Please fill in all fields');
      return;
    }

    const purchaseData = {
      vendorId: vendorId,
      amount: amount,
      price: price,
      description: description,
      expirationDate: expirationDate,
      itemId: itemId,
      ItemCategoryId: itemCategoryId,
      date: date,
    };

    try {
      setIsLoading(true);
      setError('');
      const response = await axios.post('https://apartment.houseethiopia.com/api/purchases', purchaseData);
      setIsLoading(false);
      alert('Purchase created successfully!');
      setModalOpen(true);
      setMessageType('success');
      setMessage('Purchase added successfully');
    } catch (err) {
      setIsLoading(false);
      setError('Failed to create purchase');
      setModalOpen(true);
      setMessageType('error');
      setMessage('Unable to add purchase data.');
    }
  };

  return (
    <>
      <TitleCard title={'Add'} topMargin={'mt-1'}>
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 gap-4">
          {/* Vendor Dropdown */}
         {/* Vendor Dropdown */}
          <div className="flex flex-col">
            <label className="font-semibold">Vendor</label>
            <select 
              value={vendorId} 
              onChange={(e) => setVendorId(e.target.value)} 
              className="p-2 border rounded bg-base-100"
            >
              <option value="">Select Vendor</option>
              {vendorList.map((vendor) => (
                <option key={vendor.id} value={vendor.id}>
                  {vendor.fname} {vendor.lname} {/* Show both first and last name */}
                </option>
              ))}
            </select>
          </div>
          {/* Item Category Dropdown */}
          <div className="flex flex-col">
            <label className="font-semibold">Item Category</label>
            <select 
              value={itemCategoryId} 
              onChange={(e) => setItemCategoryId(e.target.value)} 
              className="p-2 border rounded bg-base-100"
            >
              <option value="">Select Category</option>
              {categoryList.map(category => (
                <option key={category.id} value={category.id}>{category.categoryName}</option>
              ))}
            </select>
          </div>

          {/* Item Dropdown */}
          <div className="flex flex-col">
            <label className="font-semibold">Item</label>
            <input 
              type="number" 
              value={itemId} 
              onChange={(e) => setItemId(e.target.value)} 
              className="p-2 border rounded bg-base-100"
              // placeholder="Item ID"
            />
          </div>

          {/* Amount */}
          <div className="flex flex-col">
            <label className="font-semibold">Amount</label>
            <input 
              type="number" 
              value={amount} 
              onChange={(e) => setAmount(e.target.value)} 
              className="p-2 border rounded bg-base-100"
              // placeholder="Amount"
            />
          </div>

          {/* Price */}
          <div className="flex flex-col">
            <label className="font-semibold">Price</label>
            <input 
              type="number" 
              value={price} 
              onChange={(e) => setPrice(e.target.value)} 
              className="p-2 border rounded bg-base-100"
              // placeholder="Price"
            />
          </div>

          {/* Description */}
          <div className="flex flex-col">
            <label className="font-semibold">Description</label>
            <input 
              type="text" 
              value={description} 
              onChange={(e) => setDescription(e.target.value)} 
              className="p-2 border rounded bg-base-100"
              // placeholder="Description"
            />
          </div>

          {/* Expiration Date */}
          <div className="flex flex-col">
            <label className="font-semibold">Expiration Date</label>
            <input 
              type="date" 
              value={expirationDate} 
              onChange={(e) => setExpirationDate(e.target.value)} 
              className="p-2 border rounded bg-base-100"
            />
          </div>

          {/* Date */}
          <div className="flex flex-col">
            <label className="font-semibold">Date</label>
            <input 
              type="date" 
              value={date} 
              onChange={(e) => setDate(e.target.value)} 
              className="p-2 border rounded bg-base-100"
            />
          </div>

          {/* Submit Button */}
          <div className="mt-4">
            <button 
              type="submit" 
              disabled={isLoading} 
              className={`w-full py-2 bg-blue-600 text-white rounded ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {isLoading ? 'Creating Purchase...' : 'Create Purchase'}
            </button>
          </div>
        </div>
      </form>
      </TitleCard>
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        messageType={messageType}
        message={message}
      />
    </>
  );
};

export default AddPurchaseForm;

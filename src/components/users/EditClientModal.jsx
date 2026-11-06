import { useState } from "react";
import { motion } from "framer-motion";

const EditUser = ({ user, onSave, onCancel }) => {
    const [formData, setFormData] = useState(user);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(formData);
    };

    return (
        <motion.div
            className='bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700 w-full max-w-md mx-auto'
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
        >
            <h2 className='text-xl font-semibold text-gray-100 mb-4'>Edit User</h2>
            <form onSubmit={handleSubmit} className='space-y-4'>
                <div>
                    <label className='block text-gray-300'>Name</label>
                    <input
                        type='text'
                        name='name'
                        value={formData.name}
                        onChange={handleChange}
                        className='w-full bg-gray-700 text-white rounded-lg px-4 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500'
                    />
                </div>

                <div>
                    <label className='block text-gray-300'>Email</label>
                    <input
                        type='email'
                        name='email'
                        value={formData.email}
                        onChange={handleChange}
                        className='w-full bg-gray-700 text-white rounded-lg px-4 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500'
                    />
                </div>

                <div>
                    <label className='block text-gray-300'>Role</label>
                    <input
                        type='text'
                        name='role'
                        value={formData.role}
                        onChange={handleChange}
                        className='w-full bg-gray-700 text-white rounded-lg px-4 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500'
                    />
                </div>

                <div>
                    <label className='block text-gray-300'>Status</label>
                    <select
                        name='status'
                        value={formData.status}
                        onChange={handleChange}
                        className='w-full bg-gray-700 text-white rounded-lg px-4 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500'
                    >
                        <option value='Active'>Active</option>
                        <option value='Inactive'>Inactive</option>
                    </select>
                </div>

                <div className='flex justify-end space-x-3 pt-4'>
                    <button
                        type='button'
                        onClick={onCancel}
                        className='text-gray-300 hover:text-gray-100 border border-gray-500 px-4 py-2 rounded-lg'
                    >
                        Cancel
                    </button>
                    <button
                        type='submit'
                        className='bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg'
                    >
                        Save
                    </button>
                </div>
            </form>
        </motion.div>
    );
};

export default EditUser;

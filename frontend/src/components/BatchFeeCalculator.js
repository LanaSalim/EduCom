import React, { useState, useEffect } from 'react';

const BatchFeeCalculator = ({ batches, feeStructures }) => {
    const [selectedBatch, setSelectedBatch] = useState('');
    const [selectedFeeStructure, setSelectedFeeStructure] = useState('');
    const [discounts, setDiscounts] = useState([]);
    const [studentName, setStudentName] = useState('');
    const [discountCategory, setDiscountCategory] = useState('');
    const [discountAmount, setDiscountAmount] = useState('');
    const [calculatedFees, setCalculatedFees] = useState(null);
    const [loading, setLoading] = useState(false);
    const [showDiscountConfig, setShowDiscountConfig] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);

    // Discount categories constant values
    const discountCategories = [
        'Merit Scholarship',
        'Need-based Scholarship',
        'Early Bird Discount',
        'Sibling Discount',
        'Referral Discount',
        'Loyalty Discount',
        'Special Circumstances',
        'Other'
    ];

    const handleAddDiscount = () => {
        if (studentName && discountCategory && discountAmount) {
            const newDiscount = {
                id: Date.now(),
                studentName,
                discountCategory,
                discountAmount: parseFloat(discountAmount)
            };
            setDiscounts([...discounts, newDiscount]);
            setStudentName('');
            setDiscountCategory('');
            setDiscountAmount('');
        }
    };

    const removeDiscount = (id) => {
        setDiscounts(discounts.filter(d => d.id !== id));
    };

    const calculateFees = () => {
        if (!selectedBatch || !selectedFeeStructure) return;

        const batch = batches.find(b => b._id === selectedBatch);
        const feeStructure = feeStructures.find(f => f._id === selectedFeeStructure);
        
        if (!batch || !feeStructure) return;

        setLoading(true);
        
        // Simulate calculation delay
        setTimeout(() => {
            const monthlyFeePerStudent = feeStructure.monthlyFee;
            const totalStudents = batch.numberOfStudents;
            const totalMonthlyFee = monthlyFeePerStudent * totalStudents; // Total batch fee
            const totalDiscount = discounts.reduce((sum, discount) => sum + discount.discountAmount, 0);
            const finalFee = totalMonthlyFee - totalDiscount;

            setCalculatedFees({
                batch: batch,
                feeStructure: feeStructure,
                monthlyFeePerStudent,
                totalStudents,
                totalMonthlyFee,
                totalDiscount,
                finalFee,
                discounts: discounts
            });
            setLoading(false);
        }, 1000);
    };

    const handleSubmit = async () => {
        if (!selectedBatch || !selectedFeeStructure || !calculatedFees) {
            alert('Please select batch and fee structure and calculate fees first');
            return;
        }

        setSubmitting(true);
        
        try {
            // Transform discounts to match the new schema
            const studentDiscounts = calculatedFees.discounts.map(discount => {
                const fee = feeStructures.find(f => f._id === selectedFeeStructure);
                const monthlyFeeAfterDiscount = fee ? fee.monthlyFee - discount.discountAmount : 0;
                return {
                    studentName: discount.studentName,
                    discountCategory: discount.discountCategory,
                    discountAmount: discount.discountAmount,
                    monthlyFeeAfterDiscount: monthlyFeeAfterDiscount
                };
            });

            const batch = batches.find(b => b._id === selectedBatch);
            const batchFeeData = {
                batchName: batch.batchName,
                feeStructureId: selectedFeeStructure,
                studentDiscounts: studentDiscounts,
                totalMonthlyFee: calculatedFees.totalMonthlyFee,
                totalDiscount: calculatedFees.totalDiscount,
                finalFee: calculatedFees.finalFee
            };

            const response = await fetch('https://educom-1.onrender.com/api/batch-fees', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(batchFeeData)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to save batch fee calculation');
            }

            const savedData = await response.json();
            console.log('Batch fee calculation saved:', savedData);
            alert('Batch fee calculation saved successfully!');
            
            // Mark as submitted and reset form
            setIsSubmitted(true);
            setSelectedBatch('');
            setSelectedFeeStructure('');
            setDiscounts([]);
            setCalculatedFees(null);
            setShowDiscountConfig(false);
            
        } catch (error) {
            console.error('Error saving batch fee calculation:', error);
            alert(`Failed to save batch fee calculation: ${error.message}`);
        } finally {
            setSubmitting(false);
        }
    };

    useEffect(() => {
        if (selectedBatch && selectedFeeStructure) {
            calculateFees();
        }
    }, [selectedBatch, selectedFeeStructure, discounts]);

    // Auto-select first batch if not selected and not submitted
    useEffect(() => {
        if (batches.length > 0 && !selectedBatch && !isSubmitted) {
            setSelectedBatch(batches[0]._id);
        }
    }, [batches, selectedBatch, isSubmitted]);

    return (
        <div style={{ padding: '30px' }}>
            
            {/* Batch Selection - Read Only Display */}
            <div style={{ marginBottom: '30px' }}>
                <label htmlFor="batchSelect" style={{ 
                    display: 'block', 
                    marginBottom: '8px', 
                    fontWeight: '500', 
                    color: '#495057',
                    fontSize: '0.9rem'
                }}>
                    Batch Name (Read Only)
                </label>
                <select 
                    id="batchSelect"
                    value={selectedBatch} 
                    onChange={(e) => setSelectedBatch(e.target.value)}
                    style={{ 
                        padding: '12px 16px', 
                        width: '100%', 
                        maxWidth: '400px',
                        border: '1px solid #ced4da',
                        borderRadius: '6px',
                        fontSize: '0.9rem',
                        backgroundColor: 'white',
                        transition: 'border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out',
                        outline: 'none'
                    }}
                    onFocus={(e) => {
                        e.target.style.borderColor = '#007bff';
                        e.target.style.boxShadow = '0 0 0 0.2rem rgba(0, 123, 255, 0.25)';
                    }}
                    onBlur={(e) => {
                        e.target.style.borderColor = '#ced4da';
                        e.target.style.boxShadow = 'none';
                    }}
                >
                    <option value="">Select a Batch</option>
                    {batches.map(batch => (
                        <option key={batch._id} value={batch._id}>
                            {batch.batchName} - {batch.course} ({batch.medium}) - {batch.numberOfStudents} students
                        </option>
                    ))}
                </select>
            </div>

            {/* Fee Structure Selection - All Fee Structures */}
            <div style={{ marginBottom: '30px' }}>
                <label htmlFor="feeStructureSelect" style={{ 
                    display: 'block', 
                    marginBottom: '8px', 
                    fontWeight: '500', 
                    color: '#495057',
                    fontSize: '0.9rem'
                }}>
                    Select Fee Structure
                </label>
                <select 
                    id="feeStructureSelect"
                    value={selectedFeeStructure} 
                    onChange={(e) => setSelectedFeeStructure(e.target.value)}
                    style={{ 
                        padding: '12px 16px', 
                        width: '100%', 
                        maxWidth: '400px',
                        border: '1px solid #ced4da',
                        borderRadius: '6px',
                        fontSize: '0.9rem',
                        backgroundColor: 'white',
                        transition: 'border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out',
                        outline: 'none'
                    }}
                    onFocus={(e) => {
                        e.target.style.borderColor = '#007bff';
                        e.target.style.boxShadow = '0 0 0 0.2rem rgba(0, 123, 255, 0.25)';
                    }}
                    onBlur={(e) => {
                        e.target.style.borderColor = '#ced4da';
                        e.target.style.boxShadow = 'none';
                    }}
                >
                    <option value="">Select Fee Structure</option>
                    {feeStructures.map(fee => (
                        <option key={fee._id} value={fee._id}>
                            {fee.feeStructureName} - ₹{fee.monthlyFee}/month
                        </option>
                    ))}
                </select>
            </div>

            {/* Fees Display - Read Only */}
            {selectedFeeStructure && (
                <div style={{ 
                    marginBottom: '30px', 
                    padding: '20px', 
                    backgroundColor: '#f8f9fa', 
                    borderRadius: '8px',
                    border: '1px solid #e9ecef'
                }}>
                    <h4 style={{ 
                        margin: '0 0 15px 0', 
                        fontSize: '1rem', 
                        fontWeight: '500', 
                        color: '#495057'
                    }}>
                        Selected Fee Structure Details
                    </h4>
                    {(() => {
                        const fee = feeStructures.find(f => f._id === selectedFeeStructure);
                        return fee ? (
                            <div style={{ 
                                display: 'grid', 
                                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
                                gap: '15px',
                                fontSize: '0.9rem'
                            }}>
                                <div><strong style={{ color: '#495057' }}>Fee Structure:</strong> <span style={{ color: '#2c3e50' }}>{fee.feeStructureName}</span></div>
                                <div><strong style={{ color: '#495057' }}>Monthly Fee:</strong> <span style={{ color: '#2c3e50', fontWeight: '500' }}>₹{fee.monthlyFee}</span></div>
                                <div><strong style={{ color: '#495057' }}>Students Range:</strong> <span style={{ color: '#6c757d' }}>{fee.minStudents} - {fee.maxStudents}</span></div>
                                <div><strong style={{ color: '#495057' }}>Course:</strong> <span style={{ color: '#6c757d' }}>{fee.course}</span></div>
                                <div><strong style={{ color: '#495057' }}>Medium:</strong> <span style={{ color: '#6c757d' }}>{fee.medium}</span></div>
                                <div><strong style={{ color: '#495057' }}>Region:</strong> <span style={{ color: '#6c757d' }}>{fee.region}</span></div>
                                <div><strong style={{ color: '#495057' }}>Total Classes:</strong> <span style={{ color: '#6c757d' }}>{fee.totalClasses}</span></div>
                                <div><strong style={{ color: '#495057' }}>Remarks:</strong> <span style={{ color: '#6c757d' }}>{fee.remarks}</span></div>
                            </div>
                        ) : null;
                    })()}
                </div>
            )}

            {/* Discount Configuration Section */}
            <div style={{ marginBottom: '20px' }}>
                <div style={{ marginBottom: '15px' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
                        <input
                            type="checkbox"
                            checked={showDiscountConfig}
                            onChange={(e) => setShowDiscountConfig(e.target.checked)}
                            style={{ transform: 'scale(1.2)' }}
                        />
                        <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                            Do you want to configure student discount?
                        </span>
                    </label>
                </div>

                {showDiscountConfig && (
                    <div style={{ padding: '15px', backgroundColor: '#f8f9fa', borderRadius: '5px', border: '1px solid #dee2e6' }}>
                        <h4>Student Discount Configuration</h4>
                        
                        {/* Add Discount Form */}
                        <div style={{ display: 'flex', gap: '10px', marginBottom: '15px', flexWrap: 'wrap', alignItems: 'end' }}>
                            <div>
                                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Student Name:</label>
                                <input
                                    type="text"
                                    placeholder="Enter student name"
                                    value={studentName}
                                    onChange={(e) => setStudentName(e.target.value)}
                                    style={{ padding: '8px', border: '1px solid #ddd', borderRadius: '3px', width: '150px' }}
                                />
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Discount Category:</label>
                                <select
                                    value={discountCategory}
                                    onChange={(e) => setDiscountCategory(e.target.value)}
                                    style={{ padding: '8px', border: '1px solid #ddd', borderRadius: '3px', width: '180px' }}
                                >
                                    <option value="">Select Category</option>
                                    {discountCategories.map(category => (
                                        <option key={category} value={category}>{category}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Discount Amount:</label>
                                <input
                                    type="number"
                                    placeholder="Amount"
                                    value={discountAmount}
                                    onChange={(e) => setDiscountAmount(e.target.value)}
                                    style={{ padding: '8px', border: '1px solid #ddd', borderRadius: '3px', width: '120px' }}
                                />
                            </div>
                            <button 
                                onClick={handleAddDiscount}
                                style={{ 
                                    padding: '8px 16px', 
                                    backgroundColor: '#28a745', 
                                    color: 'white', 
                                    border: 'none', 
                                    borderRadius: '3px',
                                    cursor: 'pointer',
                                    height: 'fit-content'
                                }}
                            >
                                Add Discount
                            </button>
                        </div>

                        {/* Applied Discounts List */}
                        {discounts.length > 0 && (
                            <div>
                                <h5>Applied Discounts:</h5>
                                <table style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid #ddd', marginTop: '10px' }}>
                                    <thead>
                                        <tr style={{ backgroundColor: '#e9ecef' }}>
                                            <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left' }}>Student Name</th>
                                            <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left' }}>Category</th>
                                            <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left' }}>Amount</th>
                                            <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left' }}>Monthly Fee After Discount</th>
                                            <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left' }}>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {discounts.map(discount => {
                                            const fee = feeStructures.find(f => f._id === selectedFeeStructure);
                                            const monthlyFeeAfterDiscount = fee ? fee.monthlyFee - discount.discountAmount : 0;
                                            return (
                                                <tr key={discount.id}>
                                                    <td style={{ border: '1px solid #ddd', padding: '8px' }}>{discount.studentName}</td>
                                                    <td style={{ border: '1px solid #ddd', padding: '8px' }}>{discount.discountCategory}</td>
                                                    <td style={{ border: '1px solid #ddd', padding: '8px' }}>₹{discount.discountAmount}</td>
                                                    <td style={{ border: '1px solid #ddd', padding: '8px', fontWeight: 'bold', color: '#28a745' }}>
                                                        ₹{monthlyFeeAfterDiscount}
                                                    </td>
                                                    <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                                                        <button 
                                                            onClick={() => removeDiscount(discount.id)}
                                                            style={{ 
                                                                padding: '4px 8px', 
                                                                backgroundColor: '#dc3545', 
                                                                color: 'white', 
                                                                border: 'none', 
                                                                borderRadius: '3px',
                                                                cursor: 'pointer'
                                                            }}
                                                        >
                                                            Remove
                                                        </button>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Calculate Button */}
            <div style={{ marginBottom: '30px', textAlign: 'center' }}>
                <button 
                    onClick={calculateFees}
                    disabled={!selectedBatch || !selectedFeeStructure || loading}
                    style={{ 
                        padding: '12px 24px', 
                        backgroundColor: loading ? '#6c757d' : '#007bff', 
                        color: 'white', 
                        border: 'none', 
                        borderRadius: '6px',
                        cursor: loading ? 'not-allowed' : 'pointer',
                        fontSize: '0.9rem',
                        fontWeight: '500',
                        transition: 'all 0.15s ease-in-out',
                        minWidth: '200px'
                    }}
                    onMouseEnter={(e) => !loading && (e.target.style.backgroundColor = '#0056b3')}
                    onMouseLeave={(e) => !loading && (e.target.style.backgroundColor = '#007bff')}
                >
                    {loading ? 'Calculating...' : 'Calculate Total Batch Fee'}
                </button>
            </div>

            {/* Total Batch Fee Calculation Results */}
            {calculatedFees && (
                <div style={{ 
                    padding: '25px', 
                    backgroundColor: '#f8f9fa', 
                    borderRadius: '8px', 
                    border: '1px solid #e9ecef', 
                    marginBottom: '30px'
                }}>
                    <h4 style={{ 
                        margin: '0 0 20px 0', 
                        fontSize: '1.1rem', 
                        fontWeight: '500', 
                        color: '#495057',
                        textAlign: 'center'
                    }}>
                        Fee Calculation Summary
                    </h4>
                    <div style={{ 
                        display: 'grid', 
                        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
                        gap: '20px',
                        marginBottom: '20px'
                    }}>
                        <div style={{ 
                            padding: '15px', 
                            backgroundColor: 'white', 
                            borderRadius: '6px',
                            border: '1px solid #e9ecef',
                            textAlign: 'center'
                        }}>
                            <div style={{ fontSize: '0.8rem', color: '#6c757d', marginBottom: '5px' }}>Batch</div>
                            <div style={{ fontSize: '1rem', fontWeight: '500', color: '#2c3e50' }}>{calculatedFees.batch.batchName}</div>
                        </div>
                        <div style={{ 
                            padding: '15px', 
                            backgroundColor: 'white', 
                            borderRadius: '6px',
                            border: '1px solid #e9ecef',
                            textAlign: 'center'
                        }}>
                            <div style={{ fontSize: '0.8rem', color: '#6c757d', marginBottom: '5px' }}>Students</div>
                            <div style={{ fontSize: '1rem', fontWeight: '500', color: '#2c3e50' }}>{calculatedFees.totalStudents}</div>
                        </div>
                        <div style={{ 
                            padding: '15px', 
                            backgroundColor: 'white', 
                            borderRadius: '6px',
                            border: '1px solid #e9ecef',
                            textAlign: 'center'
                        }}>
                            <div style={{ fontSize: '0.8rem', color: '#6c757d', marginBottom: '5px' }}>Per Student</div>
                            <div style={{ fontSize: '1rem', fontWeight: '500', color: '#2c3e50' }}>₹{calculatedFees.monthlyFeePerStudent}</div>
                        </div>
                        <div style={{ 
                            padding: '15px', 
                            backgroundColor: 'white', 
                            borderRadius: '6px',
                            border: '1px solid #e9ecef',
                            textAlign: 'center'
                        }}>
                            <div style={{ fontSize: '0.8rem', color: '#6c757d', marginBottom: '5px' }}>Total Batch Fee</div>
                            <div style={{ fontSize: '1rem', fontWeight: '500', color: '#2c3e50' }}>₹{calculatedFees.totalMonthlyFee}</div>
                        </div>
                        <div style={{ 
                            padding: '15px', 
                            backgroundColor: 'white', 
                            borderRadius: '6px',
                            border: '1px solid #e9ecef',
                            textAlign: 'center'
                        }}>
                            <div style={{ fontSize: '0.8rem', color: '#6c757d', marginBottom: '5px' }}>Discounts</div>
                            <div style={{ fontSize: '1rem', fontWeight: '500', color: '#dc3545' }}>-₹{calculatedFees.totalDiscount}</div>
                        </div>
                    </div>
                    <div style={{ 
                        padding: '20px', 
                        backgroundColor: '#d4edda', 
                        borderRadius: '8px', 
                        border: '1px solid #c3e6cb',
                        textAlign: 'center'
                    }}>
                        <div style={{ fontSize: '0.9rem', color: '#155724', marginBottom: '8px' }}>Final Total Batch Fee</div>
                        <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#155724' }}>
                            ₹{calculatedFees.finalFee}
                        </div>
                    </div>
                </div>
            )}

            {/* Submit Button */}
            <div style={{ textAlign: 'center' }}>
                <button 
                    onClick={handleSubmit}
                    disabled={!calculatedFees || submitting}
                    style={{ 
                        padding: '12px 30px', 
                        backgroundColor: submitting ? '#6c757d' : '#28a745', 
                        color: 'white', 
                        border: 'none', 
                        borderRadius: '6px',
                        cursor: submitting ? 'not-allowed' : 'pointer',
                        fontSize: '0.9rem',
                        fontWeight: '500',
                        transition: 'all 0.15s ease-in-out',
                        minWidth: '200px'
                    }}
                    onMouseEnter={(e) => !submitting && (e.target.style.backgroundColor = '#218838')}
                    onMouseLeave={(e) => !submitting && (e.target.style.backgroundColor = '#28a745')}
                >
                    {submitting ? 'Saving...' : 'Submit Batch Fee Calculation'}
                </button>
            </div>
        </div>
    );
};

export default BatchFeeCalculator;

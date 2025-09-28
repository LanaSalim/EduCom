import React, { useState } from 'react';
import { courses, mediums, regions } from '../data/sampleData';

const FeeStructureForm = ({ onFeeStructureAdded }) => {
    const [formData, setFormData] = useState({
        name: '',
        minStudents: '',
        maxStudents: '',
        region: '',
        medium: '',
        course: '',
        monthlyFee: '',
        totalClasses: '',
        remarks: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Validation
        if (!formData.name || !formData.minStudents || !formData.maxStudents || 
            !formData.region || !formData.medium || !formData.course || 
            !formData.monthlyFee || !formData.totalClasses || !formData.remarks) {
            setError('All fields are required');
            return;
        }
        
        setError('');
        setLoading(true);
        
        try {
            // Create fee structure object matching backend schema
            const newFeeStructure = {
                feeStructureName: formData.name,
                minStudents: parseInt(formData.minStudents),
                maxStudents: parseInt(formData.maxStudents),
                region: formData.region,
                medium: formData.medium,
                course: formData.course,
                monthlyFee: parseInt(formData.monthlyFee),
                totalClasses: parseInt(formData.totalClasses),
                remarks: formData.remarks
            };
            
            // Send to backend API
            const response = await fetch('https://educom-1.onrender.com/api/fee-structures', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newFeeStructure)
            });
            
            if (!response.ok) {
                throw new Error('Failed to save fee structure');
            }
            
            const savedFeeStructure = await response.json();
            console.log('Fee structure saved to MongoDB:', savedFeeStructure);
            
            // Pass to parent component
            onFeeStructureAdded(savedFeeStructure);
            
            // Reset form
            setFormData({
                name: '', minStudents: '', maxStudents: '', region: '', medium: '', 
                course: '', monthlyFee: '', totalClasses: '', remarks: ''
            });
            
        } catch (error) {
            console.error('Error saving fee structure:', error);
            setError('Failed to save fee structure. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ padding: '30px' }}>
            <form onSubmit={handleSubmit} style={{ maxWidth: '800px' }}>
                <div style={{ 
                    display: 'grid', 
                    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
                    gap: '40px',
                    marginBottom: '30px'
                }}>
                    <div>
                        <label htmlFor="name" style={{ 
                            display: 'block', 
                            marginBottom: '8px', 
                            fontWeight: '500', 
                            color: '#495057',
                            fontSize: '0.9rem'
                        }}>
                            Fee Structure Name
                        </label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            style={{ 
                                width: '100%',
                                padding: '12px 16px',
                                border: '1px solid #ced4da',
                                borderRadius: '6px',
                                fontSize: '0.9rem',
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
                        />
                    </div>
                    
                    <div>
                        <label htmlFor="minStudents" style={{ 
                            display: 'block', 
                            marginBottom: '8px', 
                            fontWeight: '500', 
                            color: '#495057',
                            fontSize: '0.9rem'
                        }}>
                            Min Students
                        </label>
                        <input
                            type="number"
                            id="minStudents"
                            name="minStudents"
                            value={formData.minStudents}
                            onChange={handleChange}
                            style={{ 
                                width: '100%',
                                padding: '12px 16px',
                                border: '1px solid #ced4da',
                                borderRadius: '6px',
                                fontSize: '0.9rem',
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
                        />
                    </div>
                    
                    <div>
                        <label htmlFor="maxStudents" style={{ 
                            display: 'block', 
                            marginBottom: '8px', 
                            fontWeight: '500', 
                            color: '#495057',
                            fontSize: '0.9rem'
                        }}>
                            Max Students
                        </label>
                        <input
                            type="number"
                            id="maxStudents"
                            name="maxStudents"
                            value={formData.maxStudents}
                            onChange={handleChange}
                            style={{ 
                                width: '100%',
                                padding: '12px 16px',
                                border: '1px solid #ced4da',
                                borderRadius: '6px',
                                fontSize: '0.9rem',
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
                        />
                    </div>
                    
                    <div>
                        <label htmlFor="region" style={{ 
                            display: 'block', 
                            marginBottom: '8px', 
                            fontWeight: '500', 
                            color: '#495057',
                            fontSize: '0.9rem'
                        }}>
                            Region
                        </label>
                        <select 
                            id="region"
                            name="region"
                            value={formData.region} 
                            onChange={handleChange}
                            style={{ 
                                width: '100%',
                                padding: '12px 16px',
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
                            <option value="">Select Region</option>
                            {regions.map(region => (
                                <option key={region} value={region}>{region}</option>
                            ))}
                        </select>
                    </div>
                    
                    <div>
                        <label htmlFor="medium" style={{ 
                            display: 'block', 
                            marginBottom: '8px', 
                            fontWeight: '500', 
                            color: '#495057',
                            fontSize: '0.9rem'
                        }}>
                            Medium
                        </label>
                        <select 
                            id="medium"
                            name="medium"
                            value={formData.medium} 
                            onChange={handleChange}
                            style={{ 
                                width: '100%',
                                padding: '12px 16px',
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
                            <option value="">Select Medium</option>
                            {mediums.map(medium => (
                                <option key={medium} value={medium}>{medium}</option>
                            ))}
                        </select>
                    </div>
                    
                    <div>
                        <label htmlFor="course" style={{ 
                            display: 'block', 
                            marginBottom: '8px', 
                            fontWeight: '500', 
                            color: '#495057',
                            fontSize: '0.9rem'
                        }}>
                            Course
                        </label>
                        <select 
                            id="course"
                            name="course"
                            value={formData.course} 
                            onChange={handleChange}
                            style={{ 
                                width: '100%',
                                padding: '12px 16px',
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
                            <option value="">Select Course</option>
                            {courses.map(course => (
                                <option key={course} value={course}>{course}</option>
                            ))}
                        </select>
                    </div>
                    
                    <div>
                        <label htmlFor="monthlyFee" style={{ 
                            display: 'block', 
                            marginBottom: '8px', 
                            fontWeight: '500', 
                            color: '#495057',
                            fontSize: '0.9rem'
                        }}>
                            Monthly Fee
                        </label>
                        <input
                            type="number"
                            id="monthlyFee"
                            name="monthlyFee"
                            value={formData.monthlyFee}
                            onChange={handleChange}
                            style={{ 
                                width: '100%',
                                padding: '12px 16px',
                                border: '1px solid #ced4da',
                                borderRadius: '6px',
                                fontSize: '0.9rem',
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
                        />
                    </div>
                    
                    <div>
                        <label htmlFor="totalClasses" style={{ 
                            display: 'block', 
                            marginBottom: '8px', 
                            fontWeight: '500', 
                            color: '#495057',
                            fontSize: '0.9rem'
                        }}>
                            Total Classes
                        </label>
                        <input
                            type="number"
                            id="totalClasses"
                            name="totalClasses"
                            value={formData.totalClasses}
                            onChange={handleChange}
                            style={{ 
                                width: '100%',
                                padding: '12px 16px',
                                border: '1px solid #ced4da',
                                borderRadius: '6px',
                                fontSize: '0.9rem',
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
                        />
                    </div>
                    
                    <div style={{ gridColumn: '1 / -1' }}>
                        <label htmlFor="remarks" style={{ 
                            display: 'block', 
                            marginBottom: '8px', 
                            fontWeight: '500', 
                            color: '#495057',
                            fontSize: '0.9rem'
                        }}>
                            Remarks
                        </label>
                        <textarea
                            id="remarks"
                            name="remarks"
                            value={formData.remarks}
                            onChange={handleChange}
                            style={{ 
                                width: '100%',
                                padding: '12px 16px',
                                border: '1px solid #ced4da',
                                borderRadius: '6px',
                                fontSize: '0.9rem',
                                minHeight: '100px',
                                resize: 'vertical',
                                transition: 'border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out',
                                outline: 'none',
                                fontFamily: 'inherit'
                            }}
                            onFocus={(e) => {
                                e.target.style.borderColor = '#007bff';
                                e.target.style.boxShadow = '0 0 0 0.2rem rgba(0, 123, 255, 0.25)';
                            }}
                            onBlur={(e) => {
                                e.target.style.borderColor = '#ced4da';
                                e.target.style.boxShadow = 'none';
                            }}
                        />
                    </div>
                </div>
                
                {error && (
                    <div style={{ 
                        padding: '12px 16px', 
                        backgroundColor: '#f8d7da', 
                        border: '1px solid #f5c6cb', 
                        borderRadius: '6px', 
                        color: '#721c24', 
                        marginBottom: '20px',
                        fontSize: '0.9rem'
                    }}>
                        {error}
                    </div>
                )}
                
                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <button 
                        type="submit" 
                        disabled={loading}
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
                            minWidth: '120px'
                        }}
                        onMouseEnter={(e) => !loading && (e.target.style.backgroundColor = '#0056b3')}
                        onMouseLeave={(e) => !loading && (e.target.style.backgroundColor = '#007bff')}
                    >
                        {loading ? 'Saving...' : 'Save Fee Structure'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default FeeStructureForm;
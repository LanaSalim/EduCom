import React, { useState } from 'react';
import { courses, mediums } from '../data/sampleData';

const BatchDetailsForm = ({ onBatchCreated }) => {
    const [batchName, setBatchName] = useState('');
    const [numberOfStudents, setNumberOfStudents] = useState('');
    const [classesPerMonth, setClassesPerMonth] = useState('');
    const [selectedCourse, setSelectedCourse] = useState('');
    const [selectedMedium, setSelectedMedium] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!batchName || !numberOfStudents || !classesPerMonth || !selectedCourse || !selectedMedium) {
            setError('All fields are required');
            return;
        }
        setError('');
        setLoading(true);
        
        try {
            // Create batch object matching backend schema
            const newBatch = {
                batchName: batchName,
                numberOfStudents: parseInt(numberOfStudents),
                classesPerMonth: parseInt(classesPerMonth),
                course: selectedCourse,
                medium: selectedMedium
            };
            
            // Send to backend API
            const response = await fetch('https://educom-1.onrender.com/api/batches', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newBatch)
            });
            
            if (!response.ok) {
                throw new Error('Failed to save batch');
            }
            
            const savedBatch = await response.json();
            console.log('Batch saved to MongoDB:', savedBatch);
            
            // Pass to parent component with the saved data
            onBatchCreated(savedBatch);
            
            // Reset form
            setBatchName('');
            setNumberOfStudents('');
            setClassesPerMonth('');
            setSelectedCourse('');
            setSelectedMedium('');
            
        } catch (error) {
            console.error('Error saving batch:', error);
            setError('Failed to save batch. Please try again.');
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
                        <label htmlFor="batchName" style={{ 
                            display: 'block', 
                            marginBottom: '8px', 
                            fontWeight: '500', 
                            color: '#495057',
                            fontSize: '0.9rem'
                        }}>
                            Batch Name
                        </label>
                        <input
                            type="text"
                            id="batchName"
                            value={batchName}
                            onChange={(e) => setBatchName(e.target.value)}
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
                        <label htmlFor="numberOfStudents" style={{ 
                            display: 'block', 
                            marginBottom: '8px', 
                            fontWeight: '500', 
                            color: '#495057',
                            fontSize: '0.9rem'
                        }}>
                            Number of Students
                        </label>
                        <input
                            type="number"
                            id="numberOfStudents"
                            value={numberOfStudents}
                            onChange={(e) => setNumberOfStudents(e.target.value)}
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
                        <label htmlFor="classesPerMonth" style={{ 
                            display: 'block', 
                            marginBottom: '8px', 
                            fontWeight: '500', 
                            color: '#495057',
                            fontSize: '0.9rem'
                        }}>
                            Classes per Month
                        </label>
                        <input
                            type="number"
                            id="classesPerMonth"
                            value={classesPerMonth}
                            onChange={(e) => setClassesPerMonth(e.target.value)}
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
                            value={selectedCourse} 
                            onChange={(e) => setSelectedCourse(e.target.value)}
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
                            value={selectedMedium} 
                            onChange={(e) => setSelectedMedium(e.target.value)}
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
                        {loading ? 'Saving...' : 'Save Batch'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default BatchDetailsForm;
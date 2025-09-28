import React, { useState, useEffect } from 'react';
import BatchDetailsForm from './components/BatchDetailsForm';
import FeeStructureForm from './components/FeeStructureForm';
import BatchFeeCalculator from './components/BatchFeeCalculator';
import { feeStructures } from './data/sampleData';

function App() {
    const [batches, setBatches] = useState([]);
    const [feeStructuresList, setFeeStructuresList] = useState([]);
    const [loading, setLoading] = useState(true);

    // Load data from backend on component mount
    useEffect(() => {
        loadBatches();
        loadFeeStructures();
    }, []);

    const loadBatches = async () => {
        try {
            const response = await fetch('https://educom-1.onrender.com/api/batches');
            if (response.ok) {
                const data = await response.json();
                setBatches(data);
            }
        } catch (error) {
            console.error('Error loading batches:', error);
        }
    };

    const loadFeeStructures = async () => {
        try {
            const response = await fetch('https://educom-1.onrender.com/api/fee-structures');
            if (response.ok) {
                const data = await response.json();
                setFeeStructuresList(data);
            }
        } catch (error) {
            console.error('Error loading fee structures:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleBatchCreated = (newBatch) => {
        setBatches([...batches, newBatch]);
    };

    const handleFeeStructureAdded = (newFeeStructure) => {
        setFeeStructuresList([...feeStructuresList, newFeeStructure]);
    };

    if (loading) {
        return <div style={{ padding: '20px', textAlign: 'center' }}>Loading...</div>;
    }

    return (
        <div className="App" style={{ 
            minHeight: '100vh', 
            backgroundColor: '#f8f9fa', 
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
            lineHeight: '1.6'
        }}>
            <div style={{ 
                maxWidth: '1200px', 
                margin: '0 auto', 
                padding: '40px 20px'
            }}>
                <header style={{ 
                    textAlign: 'center', 
                    marginBottom: '60px',
                    paddingBottom: '30px',
                    borderBottom: '1px solid #e9ecef'
                }}>
                    <h1 style={{ 
                        fontSize: '2.5rem', 
                        fontWeight: '300', 
                        color: '#2c3e50', 
                        margin: '0 0 10px 0',
                        letterSpacing: '-0.02em'
                    }}>
                        Batch Management System
                    </h1>
                    <p style={{ 
                        color: '#6c757d', 
                        fontSize: '1.1rem', 
                        margin: '0',
                        fontWeight: '400'
                    }}>
                        Manage batches, fee structures, and calculate fees efficiently
                    </p>
                </header>
            
            {/* Section 1: Batch Details */}
            <section style={{ 
                marginBottom: '60px',
                backgroundColor: 'white',
                borderRadius: '8px',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                overflow: 'hidden'
            }}>
                <div style={{ 
                    padding: '30px',
                    borderBottom: '1px solid #e9ecef'
                }}>
                    <h2 style={{ 
                        fontSize: '1.5rem', 
                        fontWeight: '500', 
                        color: '#2c3e50', 
                        margin: '0 0 8px 0',
                        display: 'flex',
                        alignItems: 'center'
                    }}>
                        <span style={{ 
                            display: 'inline-block',
                            width: '32px',
                            height: '32px',
                            backgroundColor: '#007bff',
                            color: 'white',
                            borderRadius: '50%',
                            textAlign: 'center',
                            lineHeight: '32px',
                            fontSize: '0.9rem',
                            fontWeight: '600',
                            marginRight: '12px'
                        }}>1</span>
                        Batch Details
                </h2>
                    <p style={{ 
                        color: '#6c757d', 
                        margin: '0',
                        fontSize: '0.95rem'
                    }}>
                        Create and manage batch information
                    </p>
                </div>
                <BatchDetailsForm onBatchCreated={handleBatchCreated} />
                
                {/* Batch Details Table */}
                {batches.length > 0 && (
                    <div style={{ padding: '0 30px 30px 30px' }}>
                        <h3 style={{ 
                            fontSize: '1.1rem', 
                            fontWeight: '500', 
                            color: '#495057', 
                            margin: '0 0 20px 0'
                        }}>
                            Saved Batches
                        </h3>
                        <div style={{ 
                            overflow: 'hidden',
                            borderRadius: '6px',
                            border: '1px solid #e9ecef'
                        }}>
                            <table style={{ 
                                width: '100%', 
                                borderCollapse: 'collapse',
                                fontSize: '0.9rem'
                            }}>
                            <thead>
                                <tr style={{ backgroundColor: '#f8f9fa' }}>
                                        <th style={{ padding: '16px 20px', textAlign: 'left', fontWeight: '600', color: '#495057', borderBottom: '1px solid #e9ecef' }}>Batch Name</th>
                                        <th style={{ padding: '16px 20px', textAlign: 'left', fontWeight: '600', color: '#495057', borderBottom: '1px solid #e9ecef' }}>Students</th>
                                        <th style={{ padding: '16px 20px', textAlign: 'left', fontWeight: '600', color: '#495057', borderBottom: '1px solid #e9ecef' }}>Classes/Month</th>
                                        <th style={{ padding: '16px 20px', textAlign: 'left', fontWeight: '600', color: '#495057', borderBottom: '1px solid #e9ecef' }}>Course</th>
                                        <th style={{ padding: '16px 20px', textAlign: 'left', fontWeight: '600', color: '#495057', borderBottom: '1px solid #e9ecef' }}>Medium</th>
                                        <th style={{ padding: '16px 20px', textAlign: 'left', fontWeight: '600', color: '#495057', borderBottom: '1px solid #e9ecef' }}>Created</th>
                                </tr>
                            </thead>
                            <tbody>
                                {batches.map((batch, index) => (
                                        <tr key={batch._id || index} style={{ 
                                            borderBottom: index < batches.length - 1 ? '1px solid #f1f3f4' : 'none',
                                            transition: 'background-color 0.2s ease'
                                        }}>
                                            <td style={{ padding: '16px 20px', color: '#2c3e50', fontWeight: '500' }}>{batch.batchName}</td>
                                            <td style={{ padding: '16px 20px', color: '#6c757d' }}>{batch.numberOfStudents}</td>
                                            <td style={{ padding: '16px 20px', color: '#6c757d' }}>{batch.classesPerMonth}</td>
                                            <td style={{ padding: '16px 20px', color: '#6c757d' }}>{batch.course}</td>
                                            <td style={{ padding: '16px 20px', color: '#6c757d' }}>{batch.medium}</td>
                                            <td style={{ padding: '16px 20px', color: '#6c757d' }}>
                                            {new Date(batch.createdAt).toLocaleDateString()}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        </div>
                    </div>
                )}
            </section>

            {/* Section 2: Fee Structure */}
            <section style={{ 
                marginBottom: '60px',
                backgroundColor: 'white',
                borderRadius: '8px',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                overflow: 'hidden'
            }}>
                <div style={{ 
                    padding: '30px',
                    borderBottom: '1px solid #e9ecef'
                }}>
                    <h2 style={{ 
                        fontSize: '1.5rem', 
                        fontWeight: '500', 
                        color: '#2c3e50', 
                        margin: '0 0 8px 0',
                        display: 'flex',
                        alignItems: 'center'
                    }}>
                        <span style={{ 
                            display: 'inline-block',
                            width: '32px',
                            height: '32px',
                            backgroundColor: '#28a745',
                            color: 'white',
                            borderRadius: '50%',
                            textAlign: 'center',
                            lineHeight: '32px',
                            fontSize: '0.9rem',
                            fontWeight: '600',
                            marginRight: '12px'
                        }}>2</span>
                        Fee Structure
                </h2>
                    <p style={{ 
                        color: '#6c757d', 
                        margin: '0',
                        fontSize: '0.95rem'
                    }}>
                        Define fee structures for different courses and regions
                    </p>
                </div>
                <FeeStructureForm onFeeStructureAdded={handleFeeStructureAdded} />
                
                {/* Fee Structure Table */}
                {feeStructuresList.length > 0 && (
                    <div style={{ padding: '0 30px 30px 30px' }}>
                        <h3 style={{ 
                            fontSize: '1.1rem', 
                            fontWeight: '500', 
                            color: '#495057', 
                            margin: '0 0 20px 0'
                        }}>
                            Saved Fee Structures
                        </h3>
                        <div style={{ 
                            overflow: 'hidden',
                            borderRadius: '6px',
                            border: '1px solid #e9ecef'
                        }}>
                            <table style={{ 
                                width: '100%', 
                                borderCollapse: 'collapse',
                                fontSize: '0.9rem'
                            }}>
                            <thead>
                                <tr style={{ backgroundColor: '#f8f9fa' }}>
                                        <th style={{ padding: '16px 20px', textAlign: 'left', fontWeight: '600', color: '#495057', borderBottom: '1px solid #e9ecef' }}>Name</th>
                                        <th style={{ padding: '16px 20px', textAlign: 'left', fontWeight: '600', color: '#495057', borderBottom: '1px solid #e9ecef' }}>Students (Min - Max)</th>
                                        <th style={{ padding: '16px 20px', textAlign: 'left', fontWeight: '600', color: '#495057', borderBottom: '1px solid #e9ecef' }}>Region</th>
                                        <th style={{ padding: '16px 20px', textAlign: 'left', fontWeight: '600', color: '#495057', borderBottom: '1px solid #e9ecef' }}>Medium</th>
                                        <th style={{ padding: '16px 20px', textAlign: 'left', fontWeight: '600', color: '#495057', borderBottom: '1px solid #e9ecef' }}>Course</th>
                                        <th style={{ padding: '16px 20px', textAlign: 'left', fontWeight: '600', color: '#495057', borderBottom: '1px solid #e9ecef' }}>Monthly Fee</th>
                                        <th style={{ padding: '16px 20px', textAlign: 'left', fontWeight: '600', color: '#495057', borderBottom: '1px solid #e9ecef' }}>Classes</th>
                                        <th style={{ padding: '16px 20px', textAlign: 'left', fontWeight: '600', color: '#495057', borderBottom: '1px solid #e9ecef' }}>Remarks</th>
                                </tr>
                            </thead>
                            <tbody>
                                {feeStructuresList.map((fee, index) => (
                                        <tr key={fee._id || index} style={{ 
                                            borderBottom: index < feeStructuresList.length - 1 ? '1px solid #f1f3f4' : 'none',
                                            transition: 'background-color 0.2s ease'
                                        }}>
                                            <td style={{ padding: '16px 20px', color: '#2c3e50', fontWeight: '500' }}>{fee.feeStructureName}</td>
                                            <td style={{ padding: '16px 20px', color: '#6c757d' }}>{fee.minStudents} - {fee.maxStudents}</td>
                                            <td style={{ padding: '16px 20px', color: '#6c757d' }}>{fee.region}</td>
                                            <td style={{ padding: '16px 20px', color: '#6c757d' }}>{fee.medium}</td>
                                            <td style={{ padding: '16px 20px', color: '#6c757d' }}>{fee.course}</td>
                                            <td style={{ padding: '16px 20px', color: '#2c3e50', fontWeight: '500' }}>₹{fee.monthlyFee}</td>
                                            <td style={{ padding: '16px 20px', color: '#6c757d' }}>{fee.totalClasses}</td>
                                            <td style={{ padding: '16px 20px', color: '#6c757d' }}>{fee.remarks}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        </div>
                    </div>
                )}
            </section>

            {/* Section 3: Batch Fee Calculator */}
            <section style={{ 
                backgroundColor: 'white',
                borderRadius: '8px',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                overflow: 'hidden'
            }}>
                <div style={{ 
                    padding: '30px',
                    borderBottom: '1px solid #e9ecef'
                }}>
                    <h2 style={{ 
                        fontSize: '1.5rem', 
                        fontWeight: '500', 
                        color: '#2c3e50', 
                        margin: '0 0 8px 0',
                        display: 'flex',
                        alignItems: 'center'
                    }}>
                        <span style={{ 
                            display: 'inline-block',
                            width: '32px',
                            height: '32px',
                            backgroundColor: '#dc3545',
                            color: 'white',
                            borderRadius: '50%',
                            textAlign: 'center',
                            lineHeight: '32px',
                            fontSize: '0.9rem',
                            fontWeight: '600',
                            marginRight: '12px'
                        }}>3</span>
                        Batch Fee Calculator
                </h2>
                    <p style={{ 
                        color: '#6c757d', 
                        margin: '0',
                        fontSize: '0.95rem'
                    }}>
                        Calculate total batch fees with optional student discounts
                    </p>
                </div>
                <BatchFeeCalculator 
                    batches={batches} 
                    feeStructures={feeStructuresList}
                />
            </section>
            </div>
        </div>
    );
}

export default App;
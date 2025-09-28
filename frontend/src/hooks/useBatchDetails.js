import { useState } from 'react';

const useBatchDetails = () => {
    const [batchDetails, setBatchDetails] = useState({
        name: '',
        quantity: 0,
        date: '',
    });

    const updateBatchDetails = (newDetails) => {
        setBatchDetails((prevDetails) => ({
            ...prevDetails,
            ...newDetails,
        }));
    };

    const resetBatchDetails = () => {
        setBatchDetails({
            name: '',
            quantity: 0,
            date: '',
        });
    };

    return {
        batchDetails,
        updateBatchDetails,
        resetBatchDetails,
    };
};

export default useBatchDetails;
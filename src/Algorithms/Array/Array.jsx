import LinearSearch from "./LinearSearch";
import BinarySearch from "./BinarySearch";
import TwoPointers from "./TwoPointers";
import { Routes, Route, Navigate } from "react-router-dom";
const Array = () => {
    return (
        <Routes>
            <Route path="/" element={<Navigate to="/array/linear-search" />} />
            <Route path="/linear-search" element={<LinearSearch />} />
            <Route path="/binary-search" element={<BinarySearch />} />
            <Route path="/two-pointers" element={<TwoPointers />} />
        </Routes>
    )
}

export default Array;
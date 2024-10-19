import HomePage from "./Components/HomePage";
import './Styles/home-page.css';
import './Styles/App.css';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Tree from "./Algorithms/Tree/Tree";
import Array from "./Algorithms/Array/Array";
import Stack from "./Algorithms/Stack/Stack";
import LinkedList from "./Algorithms/LinkedList/LinkedList";
import Animation from "./Algorithms/LinkedList/Animation";
import Matrix from "./Algorithms/Matrix/Matrix";
import WorkInProgress from "./Components/WorkInProgress";
import toast, { Toaster } from "react-hot-toast";
import { useEffect } from "react";

function App() {
  useEffect(() => {
    toast.success('Welcome to Algorithm Visualizer!')
  }, [])
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/tree" element={<Tree />} />
        <Route path="/array/*" element={<Array />} />
        <Route path="/stack" element={<Stack />} />
        <Route path="/linked-list" element={<LinkedList />} />
        <Route path="/linked-list/animation" element={<Animation />} />
        <Route path="/matrix" element={<Matrix />} />
        <Route path="*" element={<WorkInProgress />}></Route>
      </Routes>
      <Toaster toastOptions={
        {
          style: {
            fontSize: '1.4rem',
            background: '#333',
            color: '#fff',
            minWidth: '400px',
          },

          position: 'top-right'
        }

      } />
    </Router >
  );
}

export default App;

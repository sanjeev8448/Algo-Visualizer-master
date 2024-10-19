import { useState, useEffect } from 'react'
const HomePage = () => {
    useEffect(() => {
        let arr = ['Array', 'Tree', 'Sorting Algorithms', 'Stack', 'Graph', 'Linked List', 'Matrix', 'Dynamic Programming', 'Greedy Algorithm', 'Recursion & Backtracking', 'Bit Manipulation', 'Heap', 'Hashing', 'String', 'Divide and Conquer', 'Advanced Algorithms'];

        let container = document.getElementById('home-page-card-container');
        for (let i in arr) {
            const el = document.createElement("div");
            el.classList.add('card');
            el.innerHTML = arr[i];
            container.appendChild(el);
            el.addEventListener('click', () => {
                window.location.href = `/${arr[i].toLowerCase().replace(/ /g, '-')}`;
                if (i == 2) window.location.href = "https://pratham2908.github.io/sorting-visualizer/";
                // if (i == 3) window.location.href = "https://d4t1r.csb.app/";
            })
        }

        window.onload = () => {
            document.querySelector("#home-page-header .title").classList.add("appear");
        }

        function appearCards(e) {
            let currHeight = window.scrollY + window.innerHeight;
            const cards = document.querySelectorAll("#home-page-card-container .card");
            cards.forEach(card => {
                let height = card.offsetTop + (card.offsetHeight * 2 / 3);
                if (currHeight >= height) {
                    card.classList.add("appear");
                }
            })
        }
        window.addEventListener("scroll", appearCards);
        window.addEventListener("load", appearCards);

    }, [])
    return (
        <div id="home-page">
            <div id='home-page-header'>
                <div className="title">
                    <h1 id='header-main-page'>Algorithm Visualizer</h1>
                    <h2 id="header-tagline">Visualize the world</h2>
                </div>
            </div>
            <div id='home-page-card-container'>
            </div>
        </div>
    )
}

export default HomePage
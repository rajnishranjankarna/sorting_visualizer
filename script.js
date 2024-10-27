// let array = [];
let array = [];
let sortingSpeed = 500; // Default speed (500ms)
let isPaused = false; // Add pause state

function updateSpeed(value) {
    sortingSpeed = value;
    document.getElementById('speedValue').innerText = value;
}

// Add pause/resume functions
function pauseVisualization() {
    isPaused = true;
}

function resumeVisualization() {
    isPaused = false;
}

// Add pause check helper
async function checkPause() {
    while(isPaused) {
        await new Promise(resolve => setTimeout(resolve, 100));
    }
}

function generateRandomArray() {
    const length = document.getElementById('arrayLength').value;
    const rangeSelect = document.getElementById('rangeSelect').value;
    let min = 0, max;

    switch (rangeSelect) {
        case 'small':
            max = 100;
            break;
        case 'medium':
            max = 1000;
            break;
        case 'large':
            max = 1000000;
            break;
    }

    array = Array.from({ length: length }, () => Math.floor(Math.random() * (max - min + 1)) + min);
    document.getElementById('arrayInput').value = array.join(',');
    renderBars(array);
}

function resetArray() {
    array = [];
    document.getElementById('barContainer').innerHTML = '';
    document.getElementById('arrayInput').value = '';
}

function renderInputArray() {
    const input = document.getElementById('arrayInput').value;
    if (input.trim() !== '') {
        array = input.split(',').map(Number);
        renderBars(array);
    }
}

function renderBars(arr) {
    const barContainer = document.getElementById('barContainer');
    barContainer.innerHTML = '';
    const maxHeight = Math.max(...arr);

    arr.forEach(value => {
        const bar = document.createElement('div');
        const height = value / maxHeight * 100; // Normalized height
        bar.style.height = `${height}%`;
        bar.className = 'bar';
        bar.style.backgroundColor = 'grey';
        bar.innerText = value; // Show value on the bar
        barContainer.appendChild(bar);
    });
}

async function selectionSort(arr) {
    const bars = document.querySelectorAll('.bar');
    const maxHeight = Math.max(...arr);
    for (let i = 0; i < arr.length - 1; i++) {
        await checkPause(); // Add pause check
        let minIndex = i;
        bars[i].style.backgroundColor = 'red'; // Current element being processed
        
        for (let j = i + 1; j < arr.length; j++) {
            await checkPause(); // Add pause check
            bars[j].style.backgroundColor = 'yellow'; // Element being compared
            
            await new Promise(resolve => setTimeout(resolve, sortingSpeed));
            
            if (arr[j] < arr[minIndex]) {
                if (minIndex !== i) {
                    bars[minIndex].style.backgroundColor = 'grey';
                }
                minIndex = j;
                bars[minIndex].style.backgroundColor = 'red';
            } else {
                bars[j].style.backgroundColor = 'grey';
            }
        }

        if (minIndex !== i) {
            [arr[i], arr[minIndex]] = [arr[minIndex], arr[i]];
            
            bars[i].style.height = `${(arr[i] / maxHeight) * 100}%`;
            bars[minIndex].style.height = `${(arr[minIndex] / maxHeight) * 100}%`;
            
            bars[i].innerText = arr[i];
            bars[minIndex].innerText = arr[minIndex];

            await new Promise(resolve => setTimeout(resolve, sortingSpeed));
            
            bars[i].style.backgroundColor = 'green';
            bars[minIndex].style.backgroundColor = 'grey';
        } else {
            bars[i].style.backgroundColor = 'green';
        }
    }
    bars[arr.length - 1].style.backgroundColor = 'green';
}

async function bubbleSort(arr) {
    const bars = document.querySelectorAll('.bar');
    const maxHeight = Math.max(...arr);
    for (let i = 0; i < arr.length - 1; i++) {
        for (let j = 0; j < arr.length - i - 1; j++) {
            await checkPause(); // Add pause check
            bars[j].style.backgroundColor = 'red';
            bars[j + 1].style.backgroundColor = 'yellow';

            await new Promise(resolve => setTimeout(resolve, sortingSpeed));

            if (arr[j] > arr[j + 1]) {
                [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
                bars[j].style.height = `${(arr[j] / maxHeight) * 100}%`;
                bars[j + 1].style.height = `${(arr[j + 1] / maxHeight) * 100}%`;
                bars[j].innerText = arr[j];
                bars[j + 1].innerText = arr[j + 1];
            }

            bars[j].style.backgroundColor = 'grey';
            bars[j + 1].style.backgroundColor = 'grey';
        }
        bars[arr.length - i - 1].style.backgroundColor = 'green';
    }
    bars[0].style.backgroundColor = 'green';
}

async function insertionSort(arr) {
    const bars = document.querySelectorAll('.bar');
    const maxHeight = Math.max(...arr);
    
    for (let i = 1; i < arr.length; i++) {
        await checkPause(); // Add pause check
        let key = arr[i];
        let j = i - 1;

        bars[i].style.backgroundColor = 'red';

        while (j >= 0 && arr[j] > key) {
            await checkPause(); // Add pause check
            bars[j].style.backgroundColor = 'yellow';
            await new Promise(resolve => setTimeout(resolve, sortingSpeed));

            arr[j + 1] = arr[j];
            bars[j + 1].style.height = `${(arr[j + 1] / maxHeight) * 100}%`;
            bars[j + 1].innerText = arr[j + 1];

            bars[j].style.backgroundColor = 'grey';
            j--;
        }

        arr[j + 1] = key;
        bars[j + 1].style.height = `${(arr[j + 1] / maxHeight) * 100}%`;
        bars[j + 1].innerText = arr[j + 1];

        for (let k = 0; k <= i; k++) {
            bars[k].style.backgroundColor = 'green';
        }

        await new Promise(resolve => setTimeout(resolve, sortingSpeed));
    }
}

async function mergeSort(arr, left = 0, right = arr.length - 1) {
    await checkPause(); // Add pause check
    if (left >= right) return;

    const mid = Math.floor((left + right) / 2);
    await mergeSort(arr, left, mid);
    await mergeSort(arr, mid + 1, right);
    await merge(arr, left, mid, right);
}

async function merge(arr, left, mid, right) {
    const bars = document.querySelectorAll('.bar');
    const maxHeight = Math.max(...arr);

    let n1 = mid - left + 1;
    let n2 = right - mid;
    
    let leftArr = new Array(n1);
    let rightArr = new Array(n2);
    
    for (let i = 0; i < n1; i++) leftArr[i] = arr[left + i];
    for (let i = 0; i < n2; i++) rightArr[i] = arr[mid + 1 + i];
    
    let i = 0, j = 0, k = left;

    while (i < n1 && j < n2) {
        await checkPause(); // Add pause check
        bars[k].style.backgroundColor = 'red';
        await new Promise(resolve => setTimeout(resolve, sortingSpeed));

        if (leftArr[i] <= rightArr[j]) {
            arr[k] = leftArr[i];
            bars[k].style.height = `${(arr[k] / maxHeight) * 100}%`;
            bars[k].innerText = arr[k];
            i++;
        } else {
            arr[k] = rightArr[j];
            bars[k].style.height = `${(arr[k] / maxHeight) * 100}%`;
            bars[k].innerText = arr[k];
            j++;
        }

        bars[k].style.backgroundColor = 'green';
        k++;
    }

    while (i < n1) {
        await checkPause(); // Add pause check
        arr[k] = leftArr[i];
        bars[k].style.height = `${(arr[k] / maxHeight) * 100}%`;
        bars[k].innerText = arr[k];
        bars[k].style.backgroundColor = 'green';
        i++;
        k++;
        await new Promise(resolve => setTimeout(resolve, sortingSpeed));
    }

    while (j < n2) {
        await checkPause(); // Add pause check
        arr[k] = rightArr[j];
        bars[k].style.height = `${(arr[k] / maxHeight) * 100}%`;
        bars[k].innerText = arr[k];
        bars[k].style.backgroundColor = 'green';
        j++;
        k++;
        await new Promise(resolve => setTimeout(resolve, sortingSpeed));
    }
}

async function quickSort(arr, low = 0, high = arr.length - 1) {
    await checkPause(); // Add pause check
    if (low < high) {
        let pivotIndex = await partition(arr, low, high);
        await quickSort(arr, low, pivotIndex - 1);
        await quickSort(arr, pivotIndex + 1, high);
    }
}

async function partition(arr, low, high) {
    const bars = document.querySelectorAll('.bar');
    const maxHeight = Math.max(...arr);
    
    let pivot = arr[high];
    let i = low - 1;

    bars[high].style.backgroundColor = 'yellow';

    for (let j = low; j < high; j++) {
        await checkPause(); // Add pause check
        bars[j].style.backgroundColor = 'red';

        await new Promise(resolve => setTimeout(resolve, sortingSpeed));

        if (arr[j] < pivot) {
            i++;
            [arr[i], arr[j]] = [arr[j], arr[i]];
            bars[i].style.height = `${(arr[i] / maxHeight) * 100}%`;
            bars[j].style.height = `${(arr[j] / maxHeight) * 100}%`;
            bars[i].innerText = arr[i];
            bars[j].innerText = arr[j];
        }

        bars[j].style.backgroundColor = 'grey';
    }

    [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
    bars[high].style.height = `${(arr[high] / maxHeight) * 100}%`;
    bars[i + 1].style.height = `${(arr[i + 1] / maxHeight) * 100}%`;
    bars[high].innerText = arr[high];
    bars[i + 1].innerText = arr[i + 1];
    
    bars[i + 1].style.backgroundColor = 'green';
    bars[high].style.backgroundColor = 'green';

    return i + 1;
}

function sortArray(algorithm) {
    if (document.getElementById('arrayInput').value.trim() !== '') {
        array = document.getElementById('arrayInput').value.split(',').map(Number);
    }

    switch (algorithm) {
        case 'selection':
            selectionSort([...array]);
            break;
        case 'bubble':
            bubbleSort([...array]);
            break;
        case 'insertion':
            insertionSort([...array]);
            break;
        case 'merge':
            mergeSort([...array]);
            break;
        case 'quick':
            quickSort([...array]);
            break;
        default:
            return;
    }
}
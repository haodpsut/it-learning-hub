
import { Lesson, QuestionType } from './types';

export const OPENROUTER_FREE_MODELS = [
  "mistralai/mistral-7b-instruct:free",
  "google/gemma-7b-it:free",
  "huggingfaceh4/zephyr-7b-beta:free",
  "openchat/openchat-7b:free",
];

export const INITIAL_LESSONS: Lesson[] = [
  {
    id: 'ds-algo-1',
    category: 'Data Structures & Algorithms',
    title: 'Introduction to Algorithms',
    content: `
# Introduction to Algorithms

An algorithm is a step-by-step procedure for calculations. Algorithms are used for calculation, data processing, and automated reasoning.

## Key Characteristics of an Algorithm

- **Input:** An algorithm has zero or more well-defined inputs.
- **Output:** An algorithm has one or more well-defined outputs and should match the desired output.
- **Finiteness:** Algorithms must terminate after a finite number of steps.
- **Definiteness:** Each step of an algorithm must be precisely defined; the actions to be carried out must be rigorously and unambiguously specified for each case.
- **Effectiveness:** An algorithm is also generally expected to be effective, in the sense that its operations must all be sufficiently basic that they can in principle be done exactly and in a finite length of time by someone using pencil and paper.

## Example: Bubble Sort

Bubble Sort is a simple sorting algorithm that repeatedly steps through the list, compares adjacent elements and swaps them if they are in the wrong order.

\`\`\`python
def bubble_sort(arr):
    n = len(arr)
    for i in range(n):
        # Last i elements are already in place
        for j in range(0, n-i-1):
            # traverse the array from 0 to n-i-1
            # Swap if the element found is greater
            # than the next element
            if arr[j] > arr[j+1]:
                arr[j], arr[j+1] = arr[j+1], arr[j]
\`\`\`
    `,
    labs: [
      {
        id: 'lab-algo-1',
        title: 'Algorithm Concepts',
        questions: [
          {
            id: 'q-algo-1',
            type: QuestionType.MCQ,
            questionText: 'Which characteristic ensures that an algorithm will eventually stop?',
            options: [
              { id: '1', text: 'Input' },
              { id: '2', text: 'Finiteness' },
              { id: '3', text: 'Effectiveness' },
              { id: '4', text: 'Definiteness' },
            ],
            correctOptionId: '2',
            explanation: 'Finiteness guarantees that an algorithm will terminate after a finite number of steps.',
          },
          {
            id: 'q-algo-2',
            type: QuestionType.MCQ,
            questionText: 'What is the primary purpose of an algorithm?',
            options: [
              { id: '1', text: 'To write code' },
              { id: '2', text: 'To solve a problem or perform a computation' },
              { id: '3', text: 'To store data' },
              { id: '4', text: 'To design a user interface' },
            ],
            correctOptionId: '2',
            explanation: 'Algorithms are fundamental recipes for solving problems or performing computations in a systematic way.',
          },
        ],
      },
    ],
  },
  {
    id: 'net-1',
    category: 'Networking',
    title: 'The OSI Model',
    content: `
# The OSI Model

The Open Systems Interconnection (OSI) model is a conceptual framework used to understand network interactions in seven layers.

## The 7 Layers

1.  **Physical Layer:** Responsible for the physical connection between devices.
2.  **Data Link Layer:** Responsible for node-to-node data transfer.
3.  **Network Layer:** Responsible for routing packets across networks. (e.g., IP)
4.  **Transport Layer:** Provides reliable data transfer services. (e.g., TCP, UDP)
5.  **Session Layer:** Manages sessions between applications.
6.  **Presentation Layer:** Translates, encrypts, and compresses data.
7.  **Application Layer:** Where network applications and their application-layer protocols operate. (e.g., HTTP, FTP)

![A diagram of the 7 layers of the OSI model](https://picsum.photos/600/400?random=1)
    `,
    labs: [
        {
            id: 'lab-net-1',
            title: 'OSI Layer Challenge',
            questions: [
                 {
                    id: 'q-net-1',
                    type: QuestionType.MCQ,
                    questionText: 'Which layer of the OSI model is responsible for routing packets between networks?',
                    options: [
                        {id: '1', text: 'Transport Layer'},
                        {id: '2', text: 'Data Link Layer'},
                        {id: '3', text: 'Network Layer'},
                        {id: '4', text: 'Physical Layer'},
                    ],
                    correctOptionId: '3',
                    explanation: 'The Network Layer handles logical addressing (like IP addresses) and determines the best path for data to travel across multiple networks.'
                 },
                 {
                    id: 'q-net-2',
                    type: QuestionType.CODE,
                    questionText: 'In Python, you might use the \`socket\` library to work with TCP connections. This library primarily operates at which layer?',
                    placeholderCode: "# TCP is part of the Transport Layer.\n# Which layer does the `socket` library abstract?\n\nanswer = 'Your answer here (e.g., Application Layer)'",
                    explanation: 'The socket library in most programming languages provides an API to the Transport Layer protocols like TCP and UDP, allowing applications to send and receive data reliably.'
                 }
            ]
        }
    ]
  },
];

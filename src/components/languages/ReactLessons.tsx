import React from 'react';
import { Lesson, Difficulty } from '../../types/quiz';

export const reactLessons: Record<Difficulty, Lesson[]> = {
  Beginner: [
    {
      id: 'react_basics_1',
      title: 'Introduction to React',
      content: `React is a JavaScript library for building user interfaces.

Key Concepts:
• JSX syntax
• Components
• Props
• State basics`,
      codeExamples: [`
// Function Component
function Welcome(props) {
  return <h1>Hello, {props.name}</h1>;
}

// Using the component
function App() {
  return (
    <div>
      <Welcome name="Alice" />
      <Welcome name="Bob" />
    </div>
  );
}`],
      difficulty: 'Beginner',
      order: 1,
    },
    {
      id: 'react_basics_2',
      title: 'State and Events',
      content: `Learn how to manage state and handle events in React.

Key Concepts:
• useState hook
• Event handlers
• State updates
• Controlled components`,
      codeExamples: [`
import { useState } from 'react';

function Counter() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>
        Increment
      </button>
    </div>
  );
}`],
      difficulty: 'Beginner',
      order: 2,
    },
    {
      id: 'react_basics_3',
      title: 'Lists and Conditionals',
      content: `Rendering lists and conditional content in React.

Key Concepts:
• Map function
• Keys in lists
• Conditional rendering
• Ternary operators`,
      codeExamples: [`
function TodoList() {
  const [todos, setTodos] = useState(['Learn React', 'Build App']);

  return (
    <ul>
      {todos.map((todo, index) => (
        <li key={index}>{todo}</li>
      ))}
      {todos.length === 0 && <p>No todos!</p>}
    </ul>
  );
}`],
      difficulty: 'Beginner',
      order: 3,
    },
    {
      id: 'react_basics_4',
      title: 'Forms and Input',
      content: `Working with forms and user input in React.

Key Concepts:
• Form handling
• Input elements
• Form submission
• Validation basics`,
      codeExamples: [`
function LoginForm() {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={formData.username}
        onChange={(e) => setFormData({
          ...formData,
          username: e.target.value
        })}
      />
      <button type="submit">Login</button>
    </form>
  );
}`],
      difficulty: 'Beginner',
      order: 4,
    },
    {
      id: 'react_basics_5',
      title: 'Component Lifecycle',
      content: `Understanding component lifecycle and effects.

Key Concepts:
• useEffect hook
• Cleanup functions
• Dependencies
• Component mounting/unmounting`,
      codeExamples: [`
function Timer() {
  const [time, setTime] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(t => t + 1);
    }, 1000);

    // Cleanup function
    return () => clearInterval(timer);
  }, []); // Empty deps array = run once

  return <p>Time: {time} seconds</p>;
}`],
      difficulty: 'Beginner',
      order: 5,
    }
  ],
  Intermediate: [
    {
      id: 'react_inter_1',
      title: 'Advanced State Management',
      content: `Complex state management techniques in React.

Key Concepts:
• useReducer hook
• Context API
• State patterns
• Performance optimization`,
      codeExamples: [`
import { useReducer } from 'react';

const initialState = { count: 0 };

function reducer(state, action) {
  switch (action.type) {
    case 'increment':
      return { count: state.count + 1 };
    case 'decrement':
      return { count: state.count - 1 };
    default:
      return state;
  }
}

function Counter() {
  const [state, dispatch] = useReducer(reducer, initialState);
  
  return (
    <>
      Count: {state.count}
      <button onClick={() => dispatch({ type: 'increment' })}>+</button>
      <button onClick={() => dispatch({ type: 'decrement' })}>-</button>
    </>
  );
}`],
      difficulty: 'Intermediate',
      order: 1,
    },
    {
      id: 'react_inter_2',
      title: 'Custom Hooks',
      content: `Create reusable logic with custom hooks.

Key Concepts:
• Hook rules
• Composing hooks
• State management
• Side effects`,
      codeExamples: [`
function useLocalStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      return initialValue;
    }
  });

  const setValue = value => {
    try {
      setStoredValue(value);
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.log(error);
    }
  };

  return [storedValue, setValue];
}`],
      difficulty: 'Intermediate',
      order: 2,
    },
    {
      id: 'react_inter_3',
      title: 'React Router',
      content: `Client-side routing in React applications.

Key Concepts:
• Route configuration
• Navigation
• Route parameters
• Protected routes`,
      codeExamples: [`
import { BrowserRouter, Route, Switch, Link } from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
      <nav>
        <Link to="/">Home</Link>
        <Link to="/about">About</Link>
      </nav>

      <Switch>
        <Route exact path="/" component={Home} />
        <Route path="/about" component={About} />
        <Route path="/user/:id" component={UserProfile} />
      </Switch>
    </BrowserRouter>
  );
}`],
      difficulty: 'Intermediate',
      order: 3,
    },
    {
      id: 'react_inter_4',
      title: 'API Integration',
      content: `Working with APIs in React.

Key Concepts:
• Fetch API
• Axios
• Error handling
• Loading states`,
      codeExamples: [`
function UserList() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('https://api.example.com/users')
      .then(res => res.json())
      .then(data => {
        setUsers(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <ul>
      {users.map(user => (
        <li key={user.id}>{user.name}</li>
      ))}
    </ul>
  );
}`],
      difficulty: 'Intermediate',
      order: 4,
    }
  ],
  Advanced: [
    {
      id: 'react_adv_1',
      title: 'Performance Optimization',
      content: `Advanced techniques for optimizing React applications.

Key Concepts:
• React.memo
• useMemo
• useCallback
• Code splitting`,
      codeExamples: [`
import { useMemo, useCallback } from 'react';

function ExpensiveComponent({ data, onItemClick }) {
  // Memoize expensive calculations
  const processedData = useMemo(() => {
    return data.map(item => expensive_operation(item));
  }, [data]);

  // Memoize callbacks
  const handleClick = useCallback((id) => {
    onItemClick(id);
  }, [onItemClick]);

  return (
    <div>
      {processedData.map(item => (
        <Item 
          key={item.id}
          data={item}
          onClick={handleClick}
        />
      ))}
    </div>
  );
}`],
      difficulty: 'Advanced',
      order: 1,
    },
    {
      id: 'react_adv_2',
      title: 'Advanced Hooks Patterns',
      content: `Complex patterns with React Hooks.

Key Concepts:
• Custom hook composition
• Hook dependencies
• Memoization patterns
• Performance optimization`,
      codeExamples: [`
function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}

function SearchComponent() {
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 500);

  useEffect(() => {
    // API call here
  }, [debouncedSearch]);
}`],
      difficulty: 'Advanced',
      order: 2,
    },
    {
      id: 'react_adv_3',
      title: 'State Management at Scale',
      content: `Managing complex state in large applications.

Key Concepts:
• Redux integration
• Context composition
• State machines
• Immutable patterns`,
      codeExamples: [`
import { createContext, useReducer, useContext } from 'react';

const StateContext = createContext();
const DispatchContext = createContext();

function AppProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  
  return (
    <StateContext.Provider value={state}>
      <DispatchContext.Provider value={dispatch}>
        {children}
      </DispatchContext.Provider>
    </StateContext.Provider>
  );
}`],
      difficulty: 'Advanced',
      order: 3,
    },
    {
      id: 'react_adv_4',
      title: 'Testing and Error Boundaries',
      content: `Advanced testing and error handling.

Key Concepts:
• Jest and React Testing Library
• Error boundaries
• Mocking
• Integration tests`,
      codeExamples: [`
class ErrorBoundary extends React.Component {
  state = { hasError: false };

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    logErrorToService(error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <h1>Something went wrong.</h1>;
    }
    return this.props.children;
  }
}`],
      difficulty: 'Advanced',
      order: 4,
    },
    {
      id: 'react_adv_5',
      title: 'Advanced Patterns',
      content: `Advanced React patterns and techniques.

Key Concepts:
• Render props
• Higher-order components
• Compound components
• Control props`,
      codeExamples: [`
// Compound components pattern
function Tabs({ children }) {
  const [activeTab, setActiveTab] = useState(0);
  
  return (
    <TabsContext.Provider value={{ activeTab, setActiveTab }}>
      {children}
    </TabsContext.Provider>
  );
}

Tabs.Panel = function TabPanel({ children, index }) {
  const { activeTab } = useTabsContext();
  return activeTab === index ? children : null;
};

// Usage
<Tabs>
  <Tabs.Panel index={0}>First panel</Tabs.Panel>
  <Tabs.Panel index={1}>Second panel</Tabs.Panel>
</Tabs>`],
      difficulty: 'Advanced',
      order: 5,
    }
  ],
}; 
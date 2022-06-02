import {createContext, useState, useEffect} from 'react';
import { v4 as uuidv4 } from 'uuid';


const FeedbackContext = createContext();

export const FeedbackProvider = ({children}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [feedback, setFeedback] = useState([]);

  const [feedbackEdit, setFeedbackEdit] = useState({
    item: {},
    edit: false,
  });

  useEffect(() => {
    fetchFeedback();
  }, []);

  const fetchFeedback = async () => {
    const response = await fetch(`/feedback?_sort=id&order=desc`);
    const data = await response.json();
    setFeedback(...feedback, data);
    setIsLoading(false);
  };

  const addFeedback = async (newFeedback) => {
    const response = await fetch('/feedback', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(newFeedback)
    })

    const data = await response.json();
    setFeedback([data, ...feedback])
  };

  const deleteFeedback = async (id) => {
    await fetch(`/feedback/${id}`, { method: 'DELETE' });
    setFeedback(feedback.filter((item) => item.id !== id));
  };

  const updateFeedback = async (id, updItem) => {
    const response = await fetch(`/feedback/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updItem)
    })
    const data = await response.json()
    setFeedback(feedback.map((item) => (item.id === id ? { ...item, ...data } : item)))
  }

  const editFeedback = (item) => {
    setFeedbackEdit({
      item,
      edit: true,
    });
    console.log('This is from the editFeedback function triggered by the edit button on ')
    console.log(item);
  };


  return (
    <FeedbackContext.Provider
      value={{
        feedback,
        feedbackEdit,
        isLoading,
        addFeedback,
        deleteFeedback,
        editFeedback,
        updateFeedback,
      }}
    >
      {children}
    </FeedbackContext.Provider>
  )
};

export default FeedbackContext;
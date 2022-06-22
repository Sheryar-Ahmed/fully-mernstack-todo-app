import React from 'react';
import {
  TextField as MuiTextField,
  Button as MuiButton,
  IconButton,
  Tooltip,
  Typography as MuiTypography
} from '@mui/material/';
import styled from 'styled-components';
import AddIcon from '@mui/icons-material/AddBoxOutlined';
import DeleteIcon from '@mui/icons-material/DeleteSweepOutlined';
import UpdateIcon from '@mui/icons-material/CleanHandsOutlined';
import axios from 'axios';
import AlertMsg from './AlertMsg';

const Wrapper = styled.div`
margin: 2rem auto;
width:50%;
background:white;
border: 1px solid #ddd;
padding:1rem;
@media(max-width:800px){
  width:100%;
}
`;
const Form = styled.form`
margin-bottom:1rem;
`;
const TodoInfo = styled.div`
display: flex;
flex-direction: row;
justify-content: space-between;
align-items: center;
align-content: centerch;
`;
const TextField = styled(MuiTextField)`
width:70%;
`;
const Button = styled(MuiButton)``;
const Typography = styled(MuiTypography)`
background: #2196f3;
padding:0.5rem;
border-radius: 4px;
width:69%;
color:white;
`;
const ButtonWrapper = styled.div`
display: flex;
flex-direction: row;
align-items: center;
justify-content: space-between;
margin-left: 2%;
`;
const Todo = () => {
  const [userTodo, SetUserTodo] = React.useState('');
  const [listTodos, setListTodos] = React.useState([]);
  const [updateText, setUpdateText] = React.useState('');
  const [showSnack, setShowSnack] = React.useState(false);
  const [error, setError] = React.useState(false);
  const [text, setText] = React.useState('');
  //getting all todos from the db
  React.useEffect(() => {
    const getAllTodos = async () => {
      try {
        const allTodos = await axios.get('http://localhost:5500/api/items', { timeout: 30000 });
        if(allTodos.data.length <= 0 ){
          setError(true);
          setText("You Don't Have Any Todo Yet, You can Create.")
        }
        setListTodos(allTodos.data);
      } catch (err) {
        setError(true);
        setText(err);
      }
    }
    getAllTodos();
  }, [])
  //adding the todo
  const addTodo = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5500/api/item', { item: userTodo, timeout: 30000 });
      setListTodos((prev) => [...prev, response.data]);
      SetUserTodo('');
      setShowSnack(true);
      setText("Todo Added Successfully.")
    } catch (err) {
      setError(true);
      setText(err);
    }
  };
  //deleting the todo from the db;
  const deleteTodo = async (id) => {
    try {
      await axios.delete(`http://localhost:5500/api/item/${id}`);
      const newListItems = listTodos.filter((todo) => todo._id !== id);
      setListTodos(newListItems);
      setShowSnack(true);
      setText("Todo Deleted Successfully.")
    } catch (err) {
      setError(true);
      setText(err);
    }
  };
  // updating the todo
  const updateTodo = async (e, id) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:5500/api/item/${id}`, { item: updateText });
      setShowSnack(true);
      setText("Todo Updated Successfully.")
    } catch (err) {
      setError(true);
      setText(err);
    }
  };

  return <React.Fragment>
    <Wrapper>
      <Form onSubmit={(e) => addTodo(e)}>
        <TodoInfo>
          <TextField
            label="Todo..."
            id="fullWidth"
            required={true}
            sx={{ width: '70%' }}
            size="small"
            onChange={(e) => SetUserTodo(e.target.value)}
            value={userTodo}
          />
          <Button
            variant="contained"
            endIcon={<AddIcon />}
            type="submit"
          >
            Add
          </Button>
        </TodoInfo>
      </Form>
      {listTodos.map((todo) => <TodoInfo key={todo._id}>
        <Typography
          contentEditable="true"
          suppressContentEditableWarning={true}
          onInput={(e) => setUpdateText(e.target.innerHTML)}
        >
          {todo.item}
        </Typography>
        <ButtonWrapper>
          <Tooltip title="Update">
            <form
              onSubmit={(e) => updateTodo(e, todo._id)}>
              <IconButton type="submit">
                <UpdateIcon htmlColor="blue" />
              </IconButton>
            </form>
          </Tooltip>
          <Tooltip title="Delete">
            <IconButton onClick={() => deleteTodo(todo._id)}>
              <DeleteIcon htmlColor="blue" />
            </IconButton>
          </Tooltip>
        </ButtonWrapper>
      </TodoInfo>)}
    </Wrapper>
    {showSnack && <AlertMsg setShow={setShowSnack} text={text} show={showSnack} />}
    {error && <AlertMsg text={text} error={error} setError={setError} />}
  </React.Fragment>
}

export default Todo;
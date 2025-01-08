import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    TextInput,
    Button,
    FlatList,
    StyleSheet,
    TouchableOpacity,
} from 'react-native';
import axios from 'axios';

const App = () => {
    const [todos, setTodos] = useState([]);
    const [text, setText] = useState('');
    const [editingTodo, setEditingTodo] = useState(null); // Tracks the todo being edited

    const API_URL = 'http://localhost:5000'; // Use 'localhost' for iOS Simulator and '10.0.2.2' for Android Emulator

    // Fetch todos from backend
    const fetchTodos = async () => {
        try {
            const response = await axios.get(`${API_URL}/todos`);
            setTodos(response.data);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        fetchTodos();
    }, []);

    // Add new todo
    const addTodo = async () => {
        if (text.trim() === '') return;
        try {
            const response = await axios.post(`${API_URL}/todos`, { text });
            setTodos([...todos, response.data]);
            setText('');
        } catch (error) {
            console.error(error);
        }
    };

    // Update existing todo
    const updateTodo = async () => {
        console.log("updated.......")
        if (!editingTodo) return; // Ensure we are in edit mode
        try {
            const response = await axios.put(`${API_URL}/todos/${editingTodo}`, { text });
            setTodos((prevTodos) =>
                prevTodos.map((todo) =>
                    todo._id == editingTodo ? response.data : todo
                )
            );
            setText(''); // Clear the input field
            setEditingTodo(null); // Exit edit mode
            fetchTodos();
        } catch (error) {
            console.error("Error updating todo:", error);
        }
    };

    // Delete todo
    const deleteTodo = async (id) => {
        try {
            await axios.delete(`${API_URL}/todos/${id}`);
            setTodos(todos.filter(todo => todo._id !== id));
        } catch (error) {
            console.error(error);
        }
    };

    // Handle edit button click
    const handleEdit = (todo) => {
        setText(todo.text); // Set the input field to the selected todo's text
        setEditingTodo(todo._id); // Enter edit mode
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>To-Do List</Text>
            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    placeholder="Add or edit a task"
                    value={text}
                    onChangeText={setText}
                />
                <Button
                    title={editingTodo ? "Update" : "Add"} // Dynamic button label
                    onPress={editingTodo ? updateTodo : addTodo} // Dynamic action
                />
            </View>
            <FlatList
                data={todos}
                keyExtractor={(item) => item._id}
                renderItem={({ item }) => (
                    <View style={styles.todoContainer}>
                        <Text style={styles.todoText}>{item.text}</Text>
                        <View>
                            <TouchableOpacity onPress={() => deleteTodo(item._id)}>
                                <Text style={styles.deleteText}>Delete</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => handleEdit(item)}>
                                <Text style={styles.updateText}>Edit</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                )}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#f8f8f8',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    input: {
        flex: 1,
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 10,
        borderRadius: 5,
        marginRight: 10,
    },
    todoContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 15,
        backgroundColor: '#fff',
        marginBottom: 10,
        borderRadius: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.3,
        shadowRadius: 2,
        elevation: 2,
    },
    todoText: {
        fontSize: 16,
    },
    deleteText: {
        color: 'red',
        fontWeight: 'bold',
    },
    updateText: {
        color: "green",
        fontWeight: 'bold',
    },
});

export default App;

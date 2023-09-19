const deleteSelectedCustomers = async () => {
    try {


    
     
      for (const customerId of selectedCustomers) {

        try {
          await deleteUser(auth, customerId);
          console.log(`User with ID ${customerId} deleted from Authentication`);
        } catch (authError) {
          console.error(`Error deleting user from Authentication: ${authError}`);
          // Handle any errors related to Firebase Authentication deletion
        }


        const querySnapshot = await getDocs(
          query(usersCollectionRef, where('id', '==', customerId))
        );
  
        if (!querySnapshot.empty) {
          // Get the first document (there should be only one if 'userId' is unique)
          const customerDoc = querySnapshot.docs[0];
  
          // Delete the document from Firestore
          await deleteDoc(customerDoc.ref);
        }
      }
      // Remove the deleted customers from the state
      const updatedCustomers = userManagment.customers.filter(
        (customer) => !selectedCustomers.includes(customer.id)
      );
      dispatch({ type: 'UPDATE_CUSTOMERS_BY_ADMIN', payload: updatedCustomers });
  
      // Clear the selection
      setSelectedCustomers([]);
    } catch (error) {
      console.error('Error deleting customers:', error);
    }
  };
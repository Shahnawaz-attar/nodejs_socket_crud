

var socket = io();

socket.on('connect', function() {
        
    socket.emit('joined','Hello from client');
    socket.emit('get_data');

} )


$('#upload_form').on('submit', function(e){
    e.preventDefault();
    
    let data = {
        name: $('#upload_form').find('input[name="name"]').val(),
        email:  $('#upload_form').find('input[name="email"]').val(),
        phone:  $('#upload_form').find('input[name="phone"]').val(),
        _id : $('#upload_form').find('input[name="_id"]').val()
    }

    socket.emit('upload', data);
    $('#upload_form').find('input').each(function(){
        $(this).val('');
    });
    
    
}
);

//saved
socket.on('saved', function(data){
    //get the data from the database
    socket.emit('get_data' , data);
});

// respone data 
socket.on('res_data', function(data){
   // in table cust-table
    $('.cust-table').find('tbody').empty();
    data.forEach(function(item){
        $('.cust-table').find('tbody').append(`
            <tr>
                <td>${item.name}</td>
                <td>${item.email}</td>
                <td>${item.phone}</td>
                <td>
                    <button class="btn btn-danger btn-sm" onclick="deleteData('${item._id}')">Delete</button>
                    <button class="btn btn-warning btn-sm" onclick="editData('${item._id}')">Edit</button>
                </td>
            </tr>
        `);
    }
    );
}
);

function deleteData(id){
    socket.emit('delete', id);
}


//deleted
socket.on('deleted', function(data){
    socket.emit('get_data' , data);
}
);

//editData
function editData(id){
    socket.emit('edit', id);
}

//edit_data
socket.on('edit_data', function(data){
    $('#upload_form').find('input').each(function(){
        $(this).val(data[$(this).attr('name')]);
    }
    );
}
);

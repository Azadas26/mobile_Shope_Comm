$(document).ready(function () {
    $("#sform").validate({
        rules:
        {
            sname:
            {
                required: true,
                minlength: 6

            },
            email:
            {
                required: true,
                email:true,
               

            },
            password:
            {
                required: true
                

            },
            address:
            {
                required: true,
                

            },
            pincode:
            {
                required: true,
              
            },
            location:
            {
                required: true,
            

            },
            image:
            {
                required: true,
            

            }
        }
    })
})

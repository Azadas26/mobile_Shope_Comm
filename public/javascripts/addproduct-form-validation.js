$(document).ready(() => {
    $("#proform").validate(
        {
            rules:
            {
                pname:
                {
                    required: true,
                    minlength: 8
                },
                mnumber:
                {
                    required:true
                },
                price:
                {
                    required:true
                },
                discription:
                {
                    required:true
                },
                image2:
                {
                    required:true
                },
                image1:
                {
                    required: true
                },
                image3:
                {
                    required: true
                }
            }
        }
    )
})
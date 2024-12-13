const postmark = require('postmark')

const sendEmailForNewSol = async (to, fname, sol_fname, sol_url, issue_url) => {
    const client = new postmark.ServerClient("414aa73d-5926-46d3-9a1f-1e4bccadf2dc");

    const message = new postmark.TemplatedMessage (
        "kartik.agarwala.21cse@bmu.edu.in",
        "code-your-own-1",
        {
            product_name : "OBounty",
            company_name : "OBounty",
            company_address : "BML Munjal University",
            user : {
                first_name : fname
            },
            solution : {
                user: sol_fname,
                url: sol_url,
                issue_url : issue_url
            }
        },
        to
    )

    const response = await client.sendEmailWithTemplate(message)
    console.log(response)
}

module.exports = sendEmailForNewSol
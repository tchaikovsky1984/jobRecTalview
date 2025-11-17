import bcrypt from "bcrypt";

async function get_pass(pass: string): Promise<string | null> {
  try {
    const hashed_pw = await bcrypt.hash(pass, 10);
    return hashed_pw;
  }
  catch (err: unknown) {
    console.log("went wrong");
    return null;
  }
}

get_pass("password1")
  .then((res) => {
    console.log(res);
  })
  .finally(() => {
    console.log("done");
  });

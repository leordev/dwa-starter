import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Typography } from "./ui/typography";
import { useWeb5 } from "@/web5/Web5Provider";
import { profile } from "@/web5/protocols";
import { drlReadProtocolJson } from "@/web5/drls";
import { toastError } from "@/lib/utils";

// async handleFileChange(type, input){
//     await this.context.initialize;
//     this.owner = this.did === this.context.did;
//     const file = input.files[0];
//     if (this.owner) {
//       this[type] = await this.context.instance.setProfileImage(type, file);
//     }
//     else {
//       this[type] = await datastore.setProfileImage(type, file, this.avatar, this.did);
//     }
//   }

//   async saveSocialInfo(e){
//     if (this.social) {
//       const formData = new FormData(this.profileForm);
//       for (const entry of formData.entries()) {
//         natives.deepSet(this.socialData, entry[0], entry[1] || undefined);
//       }
//       try {
//         await this.context.initialize;
//         if (this.did === this.context.did) {
//           const record = await this.context.instance.setSocial(this.socialData);
//           var { status } = await record.send(this.did);
//         }
//         else {
//           await this.social.update({ data: this.socialData });
//           var { status } = await this.social.send(this.did)
//         }
//         notify.success('Your profile info was saved')
//       }
//       catch(e) {
//         console.log(e)
//         notify.error('There was a problem saving your profile info')
//       }
//     }
//   }

export const ProfileSettings = () => {
  const [displayName, setDisplayName] = useState("");
  const [avatarInput, setAvatarInput] = useState<File | undefined>();
  const { dwn, did } = useWeb5();

  useEffect(() => {
    if (did) {
      loadProfile();
    }
  }, [did]);

  if (!dwn || !did) {
    return <>Web5 not initialized</>;
  }

  const loadProfile = async () => {
    const profileRecord = await drlReadProtocolJson(did, profile.uri, "name");
    console.log({ profileRecord });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log(e);
    setAvatarInput(e.target.files?.[0]);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(e);

    const res = await dwn.records.create({
      data: {
        displayName,
      },
      message: {
        published: true,
        recipient: did,
        schema: profile.schemas.name,
        dataFormat: "application/json",
        protocol: profile.uri,
        protocolPath: "name",
      },
    });

    console.info({ res });
    res.record?.send();

    setProfileImage();
  };

  const setProfileImage = async () => {
    const file = avatarInput;
    if (!file) {
      return;
    }

    // let record = _record || await datastore.getProfileImage(type, { from });
    let record;
    let blob = file ? new Blob([file], { type: file.type }) : undefined;
    try {
      if (blob) {
        record = await createAvatarImage(blob);
      }
    } catch (e) {
      console.log(e);
      toastError("There was a problem saving your profile image", e);
    }

    // TODO: review hack?
    // if (record) {
    //   record.cache = record.cache || {};
    //   record.cache.blob = blob;
    //   record.cache.uri = blob ? URL.createObjectURL(blob) : undefined;
    // }
    return record;
  };

  const createAvatarImage = async (blob: Blob) => {
    const { record, status } = await dwn.records.create({
      data: blob,
      message: {
        published: true,
        recipient: did,
        dataFormat: blob.type,
        protocol: profile.uri,
        schema: profile.schemas.avatar,
        protocolPath: "avatar",
      },
    });

    console.info({ record, status });
    record?.send();

    return record;
  };

  return (
    <>
      <Typography variant="h2">My Profile Settings</Typography>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <Typography variant="h3">Profile Image</Typography>
        <Input
          placeholder="Display Name"
          value={displayName}
          required
          onChange={(e) => setDisplayName(e.target.value)}
        />
        <input type="file" onChange={handleFileChange} />
        <Button type="submit">Save</Button>
      </form>
    </>
  );
};

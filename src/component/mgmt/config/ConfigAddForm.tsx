'use client';

import { commitAdd, getLatestConfig } from '@/lib/mongo/actions/ConfigActions';
import { TZodConfigSchema, ZodConfigSchema } from '@/lib/mongo/schema/Config';
import {
  Button,
  Checkbox,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  TextField,
} from '@mui/material';
import { useState } from 'react';

// this component is used to add new config and will override old one
export interface IAlbumAddFormProps {
  submitCallback?: () => void;
  cancelCallback?: () => void;
}

export const ConfigAddForm = ({ submitCallback, cancelCallback }: IAlbumAddFormProps) => {
  const [youtubeEmbedUrl, setyoutubeEmbedUrl] = useState<string | undefined>(undefined);
  const [youtubeStreamLink, setyoutubeStreamLink] = useState<string | undefined>(undefined);
  const [youtubeStreamKey, setyoutubeStreamKey] = useState<string | undefined>(undefined);
  const [guestSigninable, setguestSigninable] = useState<boolean>(false);
  const [ceremonyRSVPLink, setceremonyRSVPLink] = useState<string | undefined>(undefined);
  const [cocktailRSVPLink, setcocktailRSVPLink] = useState<string | undefined>(undefined);
  const [banquetRSVPLink, setbanquetRSVPLink] = useState<string | undefined>(undefined);
  const [emailjsAPIKey, setemailjsAPIKey] = useState<string | undefined>(undefined);
  const [emailjsServiceId, setemailjsServiceId] = useState<string | undefined>(undefined);
  const [emailjsTemplateId, setemailjsTemplateId] = useState<string | undefined>(undefined);
  const [emailjsBroadcastTemplateId, setemailjsBroadcastTemplateId] = useState<string | undefined>(
    undefined,
  );
  const [weddingWebsiteUrl, setweddingWebsiteUrl] = useState<string | undefined>(undefined);

  const handleCancel = async () => {
    resetForm();
    if (cancelCallback) {
      cancelCallback();
    }
  };
  const handleSubmit = async () => {
    try {
      const validatedData = ZodConfigSchema.parse({
        youtubeEmbedUrl,
        youtubeStreamLink,
        youtubeStreamKey,
        createdAt: new Date(),
        guestSigninable,
        ceremonyRSVPLink,
        cocktailRSVPLink,
        banquetRSVPLink,
        emailjsAPIKey,
        emailjsServiceId,
        emailjsTemplateId,
        emailjsBroadcastTemplateId,
        weddingWebsiteUrl,
      });
      console.log(validatedData);
      await commitAdd(validatedData);
      resetForm();
    } catch (err) {
      alert(err);
    } finally {
      if (submitCallback) {
        submitCallback();
      }
    }
  };
  const resetForm = () => {
    setyoutubeEmbedUrl(undefined);
    setyoutubeStreamLink(undefined);
    setyoutubeStreamKey(undefined);
    setguestSigninable(false);
    setceremonyRSVPLink(undefined);
    setcocktailRSVPLink(undefined);
    setbanquetRSVPLink(undefined);
    setemailjsAPIKey(undefined);
    setemailjsServiceId(undefined);
    setemailjsTemplateId(undefined);
    setemailjsBroadcastTemplateId(undefined);
    setweddingWebsiteUrl(undefined);
  };

  const handlePopulateFromLatestConfig = async () => {
    const config = (await getLatestConfig()) as TZodConfigSchema;
    setyoutubeEmbedUrl(config.youtubeEmbedUrl);
    setyoutubeStreamLink(config.youtubeStreamLink);
    setyoutubeStreamKey(config.youtubeStreamKey);
    setguestSigninable(false);
    setceremonyRSVPLink(config.ceremonyRSVPLink);
    setcocktailRSVPLink(config.cocktailRSVPLink);
    setbanquetRSVPLink(config.banquetRSVPLink);
    setemailjsAPIKey(config.emailjsAPIKey);
    setemailjsServiceId(config.emailjsServiceId);
    setemailjsTemplateId(config.emailjsTemplateId);
    setemailjsBroadcastTemplateId(config.emailjsBroadcastTemplateId);
    setweddingWebsiteUrl(config.weddingWebsiteUrl);
  };

  return (
    <div>
      <DialogTitle>New Config</DialogTitle>
      <DialogContent>
        <form className="flex flex-col gap-2">
          <TextField
            label="zoomSDKKey"
            value={youtubeEmbedUrl}
            onChange={e => setyoutubeEmbedUrl(e.target.value)}
          ></TextField>
          <TextField
            label="youtubeStreamLink"
            value={youtubeStreamLink}
            onChange={e => setyoutubeStreamLink(e.target.value)}
          ></TextField>
          <TextField
            label="youtubeStreamKey"
            value={youtubeStreamKey}
            onChange={e => setyoutubeStreamKey(e.target.value)}
          ></TextField>
          <FormControlLabel
            control={
              <Checkbox
                checked={guestSigninable}
                onChange={() => setguestSigninable(!guestSigninable)}
              ></Checkbox>
            }
            label="guestSigninable"
          />
          <TextField
            label="ceremonyRSVPLink"
            value={ceremonyRSVPLink}
            onChange={e => setceremonyRSVPLink(e.target.value)}
          ></TextField>
          <TextField
            label="cocktailRSVPLink"
            value={cocktailRSVPLink}
            onChange={e => setcocktailRSVPLink(e.target.value)}
          ></TextField>
          <TextField
            label="banquetRSVPLink"
            value={banquetRSVPLink}
            onChange={e => setbanquetRSVPLink(e.target.value)}
          ></TextField>
          <TextField
            label="emailjsAPIKey"
            value={emailjsAPIKey}
            onChange={e => setemailjsAPIKey(e.target.value)}
          ></TextField>
          <TextField
            label="emailjsServiceId"
            value={emailjsServiceId}
            onChange={e => setemailjsServiceId(e.target.value)}
          ></TextField>
          <TextField
            label="emailjsTemplateId"
            value={emailjsTemplateId}
            onChange={e => setemailjsTemplateId(e.target.value)}
          ></TextField>
          <TextField
            label="emailjsBroadcastTemplateId"
            value={emailjsBroadcastTemplateId}
            onChange={e => setemailjsBroadcastTemplateId(e.target.value)}
          ></TextField>
          <TextField
            label="weddingWebsiteUrl"
            value={weddingWebsiteUrl}
            onChange={e => setweddingWebsiteUrl(e.target.value)}
          ></TextField>
        </form>
      </DialogContent>
      <DialogActions>
        <Button type="button" onClick={handlePopulateFromLatestConfig}>
          Populate
        </Button>
        <Button type="button" onClick={handleCancel}>
          Cancel
        </Button>
        <Button type="button" onClick={handleSubmit}>
          Submit
        </Button>
      </DialogActions>
    </div>
  );
};
